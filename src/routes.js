// src/routes.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom'
import { Redirect } from 'react-router'
import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';

const Routes = () => (
  <Router>
    <div>
    <Switch>
    	<Route exact path="/" component={App}/>
    	<Route path="/about" component={About}/>
    	<Route path="/404" component={NotFound}/>
    	<Redirect from='*' to='/404' />
    </Switch>
    </div>
  </Router>
)

export default Routes;