// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <BrowserRouter>
  <App />
</BrowserRouter>
);
