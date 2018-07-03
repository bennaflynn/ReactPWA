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
import Header from './components/Header';
import NewFlow from './components/NewFlow';

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <div className="container">
            <Header />
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
              path="/newflow"
              component={NewFlow}
              exact />
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
