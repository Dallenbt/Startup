const http = require('http');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const { WebSocketServer } = require('ws');
const DB = require('./database.js');

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

let currentRound = null;
let roundClosing = false;
let heartbeatInterval = null;

async function fetchRandomFood() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    return payload?.meals?.[0]?.strMeal || `Food ${Math.ceil(Math.random() * 100)}`;
  } catch (error) {
    console.warn('Unable to fetch random food, using fallback:', error.message);
    return `Food ${Math.ceil(Math.random() * 100)}`;
  }
}

async function makeRound(lastWinner = '') {
  const food1 = await fetchRandomFood();
  let food2 = await fetchRandomFood();
  if (food1 === food2) {
    food2 = `${food2} 2`;
  }

  const startedAt = Date.now();
  const endsAt = startedAt + 30 * 1000;

  return {
    id: uuid.v4(),
    food1,
    food2,
    vote1: 0,
    vote2: 0,
    startedAt,
    endsAt,
    lastWinner,
  };
}

function broadcast(wss, data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}

async function finishRound(wss) {
  if (!currentRound) return;
  const { food1, food2, vote1, vote2 } = currentRound;
  const winnerFood = vote1 >= vote2 ? food1 : food2;

  const newGame = {
    food1,
    food2,
    vote1,
    vote2,
    winner: winnerFood,
    date: new Date().toISOString(),
  };

  await DB.addScore(newGame);
  broadcast(wss, { type: 'newGame', game: newGame });

  const nextRound = await makeRound(winnerFood);
  currentRound = nextRound;
  broadcast(wss, { type: 'round', round: currentRound });
}

function startRoundChecker(wss) {
  setInterval(async () => {
    if (roundClosing || !currentRound) return;
    if (Date.now() >= currentRound.endsAt) {
      roundClosing = true;
      try {
        await finishRound(wss);
      } catch (error) {
        console.error('Error finishing round:', error);
      } finally {
        roundClosing = false;
      }
    }
  }, 1000);
}

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await DB.updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/current-round', async (req, res) => {
  res.send(currentRound || {});
});

apiRouter.post('/score', verifyAuth, async (req, res) => {
  await DB.addScore(req.body);
  res.send({ msg: 'Score added' });
});

apiRouter.get('/score', verifyAuth, async (req, res) => {
  const scores = await DB.getScores();
  res.send(scores);
});

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  });
}

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (socket) => {
  socket.isAlive = true;
  if (currentRound) {
    socket.send(JSON.stringify({ type: 'round', round: currentRound }));
  }

  socket.on('message', async (data) => {
    try {
      const payload = JSON.parse(data.toString());
      if (!currentRound) return;

      if (payload.type === 'vote') {
        if (payload.choice === 1) {
          currentRound.vote1 += 1;
          broadcast(wss, { type: 'notification', message: `${payload.user || 'Someone'} voted for ${currentRound.food1}` });
        } else if (payload.choice === 2) {
          currentRound.vote2 += 1;
          broadcast(wss, { type: 'notification', message: `${payload.user || 'Someone'} voted for ${currentRound.food2}` });
        }
        broadcast(wss, { type: 'round', round: currentRound });
      }
    } catch (error) {
      console.warn('Invalid WebSocket message', error);
    }
  });

  socket.on('pong', () => {
    socket.isAlive = true;
  });
});

heartbeatInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (!client.isAlive) {
      return client.terminate();
    }
    client.isAlive = false;
    client.ping();
  });
}, 10000);

(async function initialize() {
  currentRound = await makeRound('');
  startRoundChecker(wss);
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
})();
