import React from 'react';
import { getRandomFood } from '../service';
import {serviceGame} from '../service';

export function Play({user}) {
  const [food1, setFood1] = React.useState('');
  const [food2, setFood2] = React.useState('');
  const [vote1, setVote1] = React.useState(0);
  const [vote2, setVote2] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(10);
  const [notification, setNotification] = React.useState('');
  const [winner, setWinner] = React.useState('');
  const [loser, setLoser] = React.useState('');

  if (!user) {
    user = {Name: 'Guest'};
  }

  async function fetchFoodPair() {
    const randomFood1 = await getRandomFood();
    const randomFood2 = await getRandomFood();
    setFood1(randomFood1);
    setFood2(randomFood2);
  }

  React.useEffect(() => {
    fetchFoodPair();
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (vote1 > vote2 && vote1 > 0) {
            setWinner(food1);
            setLoser(food2);
            serviceGame(food1, food2, vote1, vote2);
          } else if (vote2 > vote1 && vote2 > 0) {
            setWinner(food2);
            setLoser(food1);
            serviceGame(food1, food2, vote1, vote2);
          } else {
            
            setWinner('');
            setLoser('');
          }

          
          setVote1(0);
          setVote2(0);
          fetchFoodPair();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [vote1, vote2, food1, food2]);


  

  return (
    <main>
        <h1>Time to Fight!</h1>
        <p className="alert alert-success notif">Last Winner: {winner}</p>
        <h1>Time left to vote: {timeLeft}</h1>
        <p className = "alert alert-info notif" >{notification}</p>
        <main className="play-main">
        <article className ="food-card">
        <h3>{food1}</h3>
        <p>{food1} Votes: {vote1}</p>
        <img src="/glove-removebg-preview.png" alt={food1} className="food-image"></img>
        <button className="btn btn-dark voter" onClick={() => {setVote1(vote1 + 1); setNotification(`${user.Name} voted for ${food1}`);}}>Vote {food1}</button>
        </article>
        <h1 className="vs" id="playVS">VS</h1>
        <article className ="food-card">
        <h3>{food2}</h3>
        <p>{food2} Votes: {vote2}</p>
        <img src="/glove-removebg-preview.png" alt={food2} className="food-image" id="right-image"></img>
        <button className="btn btn-dark voter" onClick={() => {setVote2(vote2 + 1); setNotification(`${user.Name} voted for ${food2}`);}}>Vote {food2}</button>
        </article>
    </main>
    </main>
  );
}