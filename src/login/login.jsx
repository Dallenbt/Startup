import React from 'react';
import {serviceLoginUser} from '../service';

export function Login({setUser}) {

  const [Name, setName] = React.useState('');

  function loginUser() {
      setUser(serviceLoginUser(Name));
    }




  return (
    <main>
        <h1>Welcome to BiteFight {Name}!</h1>
      <form>
        <div>
          <span>Name</span>
          <input type="text" placeholder="Your name" value={Name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="button" className="btn btn-dark" id="join" onClick={loginUser}>Join the fight</button>
      </form>
    </main>
  );
}