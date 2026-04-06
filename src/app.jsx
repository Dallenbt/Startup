import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Results } from './results/results';
import { getGames, getCurrentRound } from './service';
import { AuthState } from './login/authState';

export default function App() {
  const [user, setUser] = React.useState(null);
  const [games, setGames] = React.useState([]);
  const [authState, setAuthState] = React.useState(AuthState.Unauthenticated);
  const [currentRound, setCurrentRound] = React.useState(null);
  const [notification, setNotification] = React.useState('');
  const [socket, setSocket] = React.useState(null);
  const socketRef = React.useRef(null);
  

  React.useEffect(() => {
    setAuthState(user ? AuthState.Authenticated : AuthState.Unauthenticated);
  }, [user]);

  React.useEffect(() => {
    let active = true;
    getGames().then((loadedGames) => {
      if (active) setGames(loadedGames);
    });
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = import.meta.env.DEV ? `${window.location.hostname}:4000` : window.location.host;
    const url = `${protocol}://${host}/ws`;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected', url);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'round') {
          setCurrentRound(message.round);
        }
        if (message.type === 'newGame') {
          setGames((prev) => [...prev, message.game]);
        }
        if (message.type === 'notification') {
          setNotification(message.message);
        }
      } catch (error) {
        console.warn('Unable to parse WS message', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    getCurrentRound().then((round) => {
      if (round && Object.keys(round).length > 0) {
        setCurrentRound(round);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  function handleAuthChange(userName, newAuthState) {
    if (newAuthState === AuthState.Authenticated) {
      setUser(userName);
    } else {
      setUser(null);
    }
    setAuthState(newAuthState);
  }

  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
          <h1 className="banner">BiteFight</h1>
          <nav>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              {authState === AuthState.Authenticated && (
                <li><NavLink to="/play">Play</NavLink></li>
              )}
              {authState === AuthState.Authenticated && (
                <li><NavLink to="/results">Results</NavLink></li>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Login userName={user} authState={authState} onAuthChange={handleAuthChange} />} />
            <Route path="/play" element={
              <Play
                user={user}
                setGames={setGames}
                authState={authState}
                currentRound={currentRound}
                notification={notification}
                socket={socket}
              />
            } />
            <Route path="/results" element={<Results user={user} games={games} />} />
            <Route path="*" element={<div className="text-center">Page Not Found</div>} />
          </Routes>
        </main>

        <footer>
          <span>Dallen Thompson</span>
          <br />
          <a href="https://github.com/Dallenbt/Startup" target="_blank">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}
