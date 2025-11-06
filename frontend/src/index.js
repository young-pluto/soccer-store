import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Ensure a global, persistent session id used across all requests
let sid = localStorage.getItem('sid');
if (!sid) {
  sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('sid', sid);
}
axios.defaults.headers.common['x-session-id'] = sid;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
