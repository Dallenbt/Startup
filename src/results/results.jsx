import React from 'react';
import './results.css'

export function Results() {
  return (
    <main>
        <h1>Take a look at past results</h1>
     <main className="results">

      
    <article className="result-card">
      <div>
        <div className="winner">
          <h2>Pizza</h2>
          <span>62%</span>
          <div></div>
          <span>310 votes</span>
        </div>
        <div className="vs">vs</div>
        <div>
          <h2>Tacos</h2>
          <span>38%</span>
          <div></div>
          <span>190 votes</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="winner-label">Winner: Pizza</span>
        <span>Jan 26, 2026</span>
      </div>
    </article>


    <article className="result-card">
      <div>
        <div>
          <h2>Burger</h2>
          <span>45%</span>
          <div></div>
          <span>225 votes</span>
        </div>
        <div className="vs">vs</div>
        <div className="winner">
          <h2>Sushi</h2>
          <span>55%</span>
          <div>
            <div></div>
          </div>
          <span>275 votes</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="winner-label"> Winner: Sushi</span>
        <span>Jan 25, 2026</span>
      </div>
    </article>

    <article className="result-card">
      <div>
        <div>
          <h2>Spagetti</h2>
          <span>55%</span>
          <div></div>
          <span>215 votes</span>
        </div>
        <div className="vs">vs</div>
        <div className="winner">
          <h2>Lasagna</h2>
          <span>45%</span>
          <div>
            <div></div>
          </div>
          <span>175 votes</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="winner-label">Winner: Spagetti</span>
        <span>Jan 24, 2026</span>
      </div>
    </article>

    <article className="result-card">
      <div>
        <div className ="winner">
          <h2>Fries</h2>
          <span>67%</span>
          <div></div>
          <span>333 votes</span>
        </div>
        <div className="vs">vs</div>
        <div>
          <h2>Hasbrowns</h2>
          <span>33%</span>
          <div>
            <div></div>
          </div>
          <span>167 votes</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="winner-label">Winner: Fries</span>
        <span>Jan 24, 2026</span>
      </div>
    </article>

    </main>
    </main>

  );
}