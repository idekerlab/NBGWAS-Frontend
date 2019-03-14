import React from 'react'
import Paper from '@material-ui/core/Paper'

import DialogInput from '../../components/DialogInput'
import InputForm from '../../components/InputForm'
import Results from '../../components/Results'
import './style.css'
import config from '../../assets/config';

/**
 * author: Brett Settle
 * 
 * Content container to hold parent location and choose between InputForm and Results components
 */
class Content extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            location: null,
            previousDialog: false
        };
        this.timer = null;
        window.content = this;
    }

    handleLocation = (location) => {
        this.setState({location})
    }

    runPrevious = (event) => {
        event.preventDefault()
        this.setState({previousDialog: true})
    }

    render(){
        const {
            location,
            previousDialog
        } = this.state;
        let style = {
            maxWidth: location === null ? '800px' : '1000px',
        }
        return (
            <Paper 
                className='paper'
                style={style}>
                {previousDialog &&
                    <DialogInput
                        handleLocation={this.handleLocation}
                        onClose={() => this.setState({previousDialog: false})}
                    />}
                {location === null ?
                    <InputForm 
                        handleLocation={this.handleLocation}
                        />
                :
                    <Results
                        location={location}
                        handleBack={() => this.handleLocation(null)}/>
                }
                {location === null && 
                    <a href="/" 
                        className="previous-link"
                        onClick={this.runPrevious}>{config.text.view_previous}</a>
                }
            </Paper>
        );
    }
}

export default Content;