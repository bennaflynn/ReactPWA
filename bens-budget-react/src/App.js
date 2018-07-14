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
import List from './components/List';
import NewUser from './components/NewUser';

class App extends Component {

  render() {
    return (
        <BrowserRouter>
          <div className='wrapper'>
          <Header />
          <div className="container">
            
            <Switch>
              <Route 
              path="/"
              component={Login}
              exact
              />
              <Route 
              path="/newuser"
              component={NewUser}
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
              path="/all"
              component={List}
              exact />
              <Route
              //the default route
              component={Login}
              />
            </Switch>           
          </div>
          <div className='footer'>
            <p>Made With &lt;3 By Ben</p>
          </div>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
