import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SavedTithes from './pages/SavedTithes';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
//  <Route exact path='/' component={SearchBooks} />

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <Switch>
       
        <Route exact path='/' component={HomePage} />
          <Route exact path='/saved' component={SavedTithes} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
