import React from 'react'
import Paper from '@material-ui/core/Paper'
import InputForm from './InputForm'
import Results from './Results'
import { LinearProgress } from '@material-ui/core';
import DATA from '../data'
import axios from 'axios'

const styles = {
    paper: {
        width: '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '10px',
        alignContent: 'center',
        marginBottom: '20px'
    },
}

class Content extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            location: null,
            running: false,
            data: null,
            complete: 0
        };
        this.timer = null;
    }

    handleResponse = (res) => {
        window.resp = res
        console.log(res)

        if (res['data'] === 'failed'){
            this.setState({ running: false })
            return;
        }

        const location = res.headers['location'];
        this.setState({running: false, location})
    }

    handleClear = () => {
        this.setState({running: false, location: null, data: null})
    }

    componentDidMount(){
        
    }

    handleSubmit = (data) => {
        const config = {
            onUploadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.setState({ complete: percentCompleted })
            }
        }
        this.setState({running: true})
        axios.post(DATA.endpoint, data, config)
        .then(res => { this.handleResponse(res) })
        .catch(error => {
            window.err = error
            alert(error.stack)
            this.setState({ running: false })
            
        })
    }

    render(){
        const {data, location, running, complete} = this.state;
        let paperStyle = {
            marginTop: '100px',
            maxWidth: data === null ? '800px' : 'none', 
            ...styles.paper};
        return (
            <div>
                <Paper style={paperStyle}>
                    {running ? 
                        <div>
                            <p>Submitting task...</p>
                            <LinearProgress variant="determinate" value={complete}/>
                        </div>
                     :
                        (location === null ?
                            <InputForm 
                                handleSubmit={this.handleSubmit}
                                />
                        :
                            <Results location={location} handleBack={this.handleClear}/>
                        )
                    }
                </Paper>
            </div>
        );
    }
}

export default Content;