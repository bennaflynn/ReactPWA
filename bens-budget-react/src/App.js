import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//load components
import Finances from './components/Finances';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Finances />
      </div>
    );
  }
}

export default App;
