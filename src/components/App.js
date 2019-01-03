import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
// import logo from '../logo.svg';
import '../styles/App.css';
import '../styles/bootstrap.min.css';
import Header from './Header';
import Login from './Login';
import AssetList from './definition-views/Asset/ListView';
import AssetValueList from './create-edit-views/AssetValue/ListView';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="ph3 pv1 background-gray ">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/define" component={AssetList} />
            <Route exact path="/create" component={AssetValueList} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
