import React from 'react';
import { AuthState } from '../login/authState';

export function Play({ user, authState, currentRound, notification, socket }) {
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [localNotification, setLocalNotification] = React.useState('');

  React.useEffect(() => {
    if (!currentRound) return undefined;

    function updateTime() {
      const remaining = Math.max(0, Math.ceil((currentRound.endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    }

    updateTime();
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, [currentRound]);

  
  function vote(choice) {
    setLocalNotification(`${user} voted`);
    if (!socket || socket.readyState !== WebSocket.OPEN || !currentRound) {
      setLocalNotification('Unable to send vote yet. Refresh the page if this persists.');
      return;
    }

    socket.send(JSON.stringify({ type: 'vote', choice, user }));
  }

  if (authState !== AuthState.Authenticated) {
    return <main>Please log in to play.</main>;
  }

  if (!currentRound) {
    return <main>Connecting to game server...</main>;
  }

  return (
    <main>
      <h1>Time to Fight!</h1>
      <p className="alert alert-success notif">Last Winner: {currentRound.lastWinner || 'None yet'}</p>
      <h2>Time left to vote: {timeLeft}</h2>
      <p className="alert alert-info notif">{notification || localNotification}</p>
      <section className="play-main">
        <article className="food-card">
          <h3>{currentRound.food1}</h3>
          <p>{currentRound.food1} Votes: {currentRound.vote1}</p>
          <img src="/glove-removebg-preview.png" alt={currentRound.food1} className="food-image" />
          <button
            className="btn btn-dark voter"
            disabled={timeLeft === 0}
            onClick={() => vote(1)}
          >
            Vote {currentRound.food1}
          </button>
        </article>

        <h1 className="vs" id="playVS">VS</h1>

        <article className="food-card">
          <h3>{currentRound.food2}</h3>
          <p>{currentRound.food2} Votes: {currentRound.vote2}</p>
          <img src="/glove-removebg-preview.png" alt={currentRound.food2} className="food-image" />
          <button
            className="btn btn-dark voter"
            disabled={timeLeft === 0}
            onClick={() => vote(2)}
          >
            Vote {currentRound.food2}
          </button>
        </article>
      </section>
    </main>
  );
}

