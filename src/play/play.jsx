import React from 'react';

export function Play() {
  return (
    <main>
        <h1>Time to Fight!</h1>
        <p className = "alert alert-info notif" >Dallen voted for Corndog</p>
        <main className="play-main">
        <article className ="food-card">
        <h3>Corndog</h3>
        <p>Corndog Votes: 10</p>
        <img src="/corndog.jpg" alt="Corndog"></img>
        <button className="btn btn-dark voter">Vote Corndog</button>
        </article>
        <h1 className="vs" id="playVS">VS</h1>
        <article className ="food-card">
        <h3>Hotdog</h3>
        <p>Hotdog Votes: 8</p>
        <img src="/hotdog.jpg" alt="Hotdog"></img>
        <button className="btn btn-dark voter">Vote Hotdog</button>
        </article>
    </main>
    </main>
  );
}