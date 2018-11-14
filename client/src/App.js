import React, { Component } from 'react';
import NavBar from './components/NavBar'
import InputForm from './components/InputForm'
import form_data from './data'
import axios from 'axios'

class App extends Component {

  handleRun(args) {
    console.log(args)
    // network, seeds, alpha

    axios.post(form_data.api, args)
      .then(res => {
        console.log(res)
      })
  }

  render() {
    return (
      <div >
        <NavBar />
        <InputForm
          handleRun={this.handleRun} />
      </div>
    );
  }
}

export default App;
