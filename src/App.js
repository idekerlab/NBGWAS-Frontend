import React, { Component } from 'react';
import NavBar from './components/NavBar'
import axios from 'axios'

import InputForm from './components/InputForm'
import Results from './components/Results'

const ENDPOINT = "/rest/v1/nbgwas/tasks";
// const ENDPOINT = "http://nbgwas/ucsd.edu/rest/v1/nbgwas/tasks";


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  compareResults(a, b) {
    return b.value - a.value
  }


  handleRun = (formData, goldStandard, top) => {
    axios.post(ENDPOINT, formData)
    .then(res => {
      window.res = res;
      console.log(res);
    })

    // axios.post("/nbgwas", formData)
    //   .then(res => {
    //     if (res['data'] === 'failed'){
    //       console.log(res)
    //       alert("Failed to run NBGWAS!")
    //       return;
    //     }
    //     let rows = Object.keys(res.data).map(key => {
    //       return {id: key, value: res.data[key]}
    //     })

    //     rows = rows.sort(this.compareResults, ).slice(0, top);
    //     this.setState({data: rows})
    //   })
  }

  clear() {
    this.setState({data: null})
  }

  render() {
    const {data} = this.state;

    return (
      <div >
        <NavBar />
        <div style={{paddingTop: '100px'}}>
          {data !== null ?
            <Results
              handleBack={() => this.clear()}
              data={data}
              />
            :
            <InputForm
              handleRun={this.handleRun} />
          }
        </div>
      </div>
    );
  }
}

export default App;
