import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Results } from './results/results';


export default function App() {
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
        <hr/>
        
        <main>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/play" element={<Play />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<div className="text-center">Page Not Found</div>} />
            </Routes>
        </main>

        <footer>
        <hr />
        <span>Dallen Thompson</span>
        <br />
        <a href="https://github.com/Dallenbt/Startup" target="_blank">GitHub</a>
        </footer>
    </div>
    </BrowserRouter>
    );
}