import React from 'react';

import './App.css';
import { Switch, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import Header from './components/Header/Header';
import LivePage from './Pages/LivePage/LivePage';
import RecordedStreamPage from './Pages/RecordedStreamPage/RecordedStreamPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/live" component={LivePage} />
        <Route exact path="/rec" component={RecordedStreamPage} />
      </Switch>
    </div>
  );
}

export default App;
