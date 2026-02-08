import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const isAuthenticated = false; // Replace with actual authentication logic

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/dashboard'>
          {isAuthenticated ? <Dashboard /> : <Redirect to='/login' />}
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
  );
};

export default App;