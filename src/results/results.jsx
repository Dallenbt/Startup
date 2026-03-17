import React from 'react';
import styles from './results.module.css';


import { getGames } from '../service';

export function Results({games: propGames}) {
  
  const [games, setGames] = React.useState(propGames);

  console.log('Games data (props):', propGames);

  React.useEffect(() => {
    getGamesData();
  }, []);


  async function getGamesData() {
    games = await fetch('/api/score', {
      method: 'GET',
      credentials: 'include',
    }).then((response) => response.json());
    setGames(games);
  }

  return (
    <main className={styles.resultsPage}>
        <h1>Take a look at past results</h1>
     <main className="results">

    {games.map((game, index) => (
      <article key={index} className="result-card">
        <div>
          <div className={game.winner === game.food1 ? "winner" : ""}>
            <h2>{game.food1}</h2>
            <span>{(game.vote1 / (game.vote1 + game.vote2) * 100).toFixed(0)}%</span>
          <div></div>
          <span>{game.vote1} votes</span>
        </div>
        <div className="vs">vs</div>
        <div className={game.winner === game.food2 ? "winner" : ""}>
          <h2>{game.food2}</h2>
          <span>{(game.vote2 / (game.vote1 + game.vote2) * 100).toFixed(0)}%</span>
          <div></div>
          <span>{game.vote2} votes</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="winner-label">Winner: {game.winner}</span>
        <span>{new Date(game.date).toLocaleDateString()}</span>
      </div>
    </article>
    ))}


      </main>
    </main>

  );
}