import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return <div className="body bg-dark text-light">
        <header>
            <h1 className="banner">BiteFight</h1>
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="play.html">Play</a></li>
                    <li><a href="results.html">Results</a></li>
                </ul>
            </nav>
        </header>
        <hr/>
        
        <main>
            <p>componet here</p>
        </main>

        <footer>
        <hr />
        <span>Dallen Thompson</span>
        <br />
        <a href="https://github.com/Dallenbt/Startup" target="_blank">GitHub</a>
        </footer>
    </div>;
}