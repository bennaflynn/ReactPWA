import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//import cookies
import {CookiesProvider} from 'react-cookie';

//load components
import Finances from './components/Finances';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      
        <div className="container">
          <Login />
          <Finances />
        </div>

    );
  }
}

export default App;
