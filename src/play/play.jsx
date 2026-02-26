import React from 'react';
import { getRandomFood } from '../service';

export function Play({user}) {
  const [food1, setFood1] = React.useState('');
  const [food2, setFood2] = React.useState('');
  const [vote1, setVote1] = React.useState(0);
  const [vote2, setVote2] = React.useState(0);

  
  if (!user) {
    user = {Name: 'Guest'};
  }

  React.useEffect(() => {
    async function fetchFood() {
      const randomFood1 = await getRandomFood();
      const randomFood2 = await getRandomFood();
      setFood1(randomFood1);
      setFood2(randomFood2);
    }

    fetchFood();
  }, []);

  

  return (
    <main>
        <h1>Time to Fight!</h1>
        <h1>Time left to vote: 10</h1>
        <p className = "alert alert-info notif" > {user.Name} voted for {food1}</p>
        <main className="play-main">
        <article className ="food-card">
        <h3>{food1}</h3>
        <p>{food1} Votes: {vote1}</p>
        <img src="/glove-removebg-preview.png" alt={food1} className="food-image"></img>
        <button className="btn btn-dark voter" onClick={() => setVote1(vote1 + 1)}>Vote {food1}</button>
        </article>
        <h1 className="vs" id="playVS">VS</h1>
        <article className ="food-card">
        <h3>{food2}</h3>
        <p>{food2} Votes: {vote2}</p>
        <img src="/glove-removebg-preview.png" alt={food2} className="food-image" id="right-image"></img>
        <button className="btn btn-dark voter" onClick={() => setVote2(vote2 + 1)}>Vote {food2}</button>
        </article>
    </main>
    </main>
  );
}