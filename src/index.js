import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Footer from './components/footer/Footer.js'
import Header from './components/header/Header.js';
import Body from './components/body/Body.js';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Body />
    <App />
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);