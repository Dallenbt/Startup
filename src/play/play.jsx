import React from 'react';
import { getRandomFood, saveGame } from '../service';
import { AuthState } from '../login/authState';

export function Play({ user, setGames, authState }) {
  const [food1, setFood1] = React.useState('');
  const [food2, setFood2] = React.useState('');
  const [vote1, setVote1] = React.useState(0);
  const [vote2, setVote2] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [notification, setNotification] = React.useState('');
  const [winner, setWinner] = React.useState('');

  async function fetchFoodPair() {
    const randomFood1 = await getRandomFood();
    const randomFood2 = await getRandomFood();
    setFood1(randomFood1 || 'Food A');
    setFood2(randomFood2 || 'Food B');
  }

  React.useEffect(() => {
    fetchFoodPair();
  }, []);

  React.useEffect(() => {
    if (authState !== AuthState.Authenticated) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [authState]);

  React.useEffect(() => {
    if (timeLeft !== 0) return;

    async function finishRound() {
      if (vote1 > 0 || vote2 > 0) {
        const winnerFood = vote1 >= vote2 ? food1 : food2;
        const newGame = {
          food1,
          food2,
          vote1,
          vote2,
          winner: winnerFood,
          date: new Date().toISOString(),
          user,
        };

        const savedGames = await saveGame(newGame);
        if (savedGames) {
          setGames(savedGames);
        }

        setWinner(winnerFood);
      }
      setVote1(0);
      setVote2(0);
      setNotification('');
      await fetchFoodPair();
      setTimeLeft(30);
    }

    finishRound();
  }, [timeLeft, vote1, vote2, food1, food2, user, setGames]);

  if (authState !== AuthState.Authenticated) {
    return <main>Please log in to play.</main>;
  }

  return (
    <main>
      <h1>Time to Fight!</h1>
      <p className="alert alert-success notif">Last Winner: {winner}</p>
      <h2>Time left to vote: {timeLeft}</h2>
      <p className="alert alert-info notif">{notification}</p>
      <section className="play-main">
        <article className="food-card">
          <h3>{food1}</h3>
          <p>{food1} Votes: {vote1}</p>
          <img src="/glove-removebg-preview.png" alt={food1} className="food-image" />
          <button
            className="btn btn-dark voter"
            onClick={() => {
              setVote1((prev) => prev + 1);
              setNotification(`${user} voted for ${food1}`);
            }}
          >
            Vote {food1}
          </button>
        </article>

        <h1 className="vs" id="playVS">VS</h1>

        <article className="food-card">
          <h3>{food2}</h3>
          <p>{food2} Votes: {vote2}</p>
          <img src="/glove-removebg-preview.png" alt={food2} className="food-image" />
          <button
            className="btn btn-dark voter"
            onClick={() => {
              setVote2((prev) => prev + 1);
              setNotification(`${user} voted for ${food2}`);
            }}
          >
            Vote {food2}
          </button>
        </article>
      </section>
    </main>
  );
}
