import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Footer from './components/footer/Footer.js'
import Header from './components/Header';
import Body from './components/Body';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Body />
    <App />
    <br></br>
    <br></br>
    <br></br> 
    <br></br>
    <br></br>
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);