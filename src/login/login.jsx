import React from 'react';
import {serviceLoginUser} from '../service';
import {MessageDialog} from './messageDialog';

export function Login({setUser}) {

  const [Name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: Name, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', Name);
      props.onLogin(Name);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }




  return (
    <main>
        <h1>Welcome to BiteFight {Name}!</h1>
      <form>
        <div>
          <span>Username</span>
          <input type="text" placeholder="Your name"  onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <span>Password</span>
          <input type="password" placeholder="Your password" onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="button" className="btn btn-dark" id="join" onClick={loginUser}>Login</button>
        <button type="button" className="btn btn-dark" id="join" onClick={createUser}>Create Account</button>
      </form>
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </main>
  );
}