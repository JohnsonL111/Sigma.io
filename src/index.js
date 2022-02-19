import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import asm_api from './server/asm_api.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);