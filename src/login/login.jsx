import React from 'react';

export function Login() {
  return (
    <main>
        <h1>Welcome to BiteFight</h1>
      <form method="get" action="play.html">
        <div>
          <span>Name</span>
          <input type="text" placeholder="Your name" />
        </div>
        <button type="submit" className="btn btn-dark" id="join">Join the fight</button>
      </form>
    </main>
  );
}