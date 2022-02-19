import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Asm_api from './server/Asm_api';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Asm_api />
  </React.StrictMode>,
  document.getElementById('root')
);