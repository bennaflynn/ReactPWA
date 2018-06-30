import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//routing
import {BrowserRouter, Route, Switch} from 'react-router-dom';
//import cookies
import {CookiesProvider} from 'react-cookie';

//load components
import Finances from './components/Finances';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <div className="container">
            <Switch>
              <Route 
              path="/"
              component={Login}
              exact
              />
              <Route 
              path="/finances"
              component={Finances}
              exact/>
              <Route
              //the default route
              component={Login}
              />
            </Switch>           
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
