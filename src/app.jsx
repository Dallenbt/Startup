import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Results } from './results/results';


export default function App() {
    const [user, setUser] = React.useState(null);
    const [games, setGames] = React.useState([]);

    React.useEffect(() => {
        const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
        setGames(storedGames);
    }, []);

  return (
  <BrowserRouter>
  <div className="body bg-dark text-light">
        <header>
            <h1 className="banner">BiteFight</h1>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/play">Play</NavLink></li>
                    <li><NavLink to="/results">Results</NavLink></li>
                </ul>
            </nav>
        </header>
        
        
        <main>
            <Routes>
                <Route path="/" element={<Login setUser={setUser}/>} />
                <Route path="/play" element={<Play user={user} />} />
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