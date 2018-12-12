import './App.css'
import React, { Component } from 'react';

import NavBar from './components/NavBar'
import Content from './components/Content'


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar/>
        <Content/>
      </div>
    );
  }
}

export default App;
