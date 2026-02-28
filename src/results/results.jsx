import React from 'react';
import styles from './results.module.css';


export function Results({games}) {
  console.log('Games data:', games);

  

  return (
    <main className={styles.resultsPage}>
        <h1>Take a look at past results</h1>
     <main className="results">

    {games.map((game, index) => (
      <article key={index} className="result-card">
        <div>
          <div className="winner">
            <h2>{game.food1}</h2>
            <span>{(game.vote1 / (game.vote1 + game.vote2) * 100).toFixed(0)}%</span>
          <div></div>
          <span>{game.vote1 + game.vote2} votes</span>
        </div>
        <div className="vs">vs</div>
        <div>
          <h2>{game.food2}</h2>
          <span>{(game.vote2 / (game.vote1 + game.vote2) * 100).toFixed(0)}%</span>
          <div></div>
          <span>{game.vote1 + game.vote2} votes</span>
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