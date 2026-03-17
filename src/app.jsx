import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/unauthenticated';
import { Play } from './play/play';
import { Results } from './results/results';
import { getGames } from './service';
import { AuthState } from './login/authState';


export default function App() {
    const [user, setUser] = React.useState(null);
    const [games, setGames] = React.useState(() => getGames());
    const currentAuthState = user ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    

  return (
  <BrowserRouter>
  <div className="body bg-dark text-light">
        <header>
            <h1 className="banner">BiteFight</h1>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    {authState === AuthState.Authenticated && (
                        <li><NavLink to="/play">Play</NavLink></li>
                    )}
                    {authState === AuthState.Authenticated && (
                        <li><NavLink to="/results">Results</NavLink></li>
                    )}
                </ul>
            </nav>
        </header>
        
        
        <main>
            <Routes>
                <Route path="/" element={<Login setUser={setUser} authState={authState} onAuthChange={setAuthState} />} />
                <Route path="/play" element={<Play user={user} setGames={setGames} />} />
                <Route path="/results" element={<Results user={user} games={games} />} />
                <Route path="*" element={<div className="text-center">Page Not Found</div>} />
            </Routes>
        </main>

        <footer>
        <span>Dallen Thompson</span>
        <br />
        <a href="https://github.com/Dallenbt/Startup" target="_blank">GitHub</a>
        </footer>
    </div>
    </BrowserRouter>
    );
}