// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import TournamentPage from './routes/TournamentPage';
import PlayerHistory from './routes/PlayerHistory';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tournament/:id" element={<TournamentPage />} />
        <Route path="/player/:name" element={<PlayerHistory />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
