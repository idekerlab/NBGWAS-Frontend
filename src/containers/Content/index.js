import React from 'react'
import Paper from '@material-ui/core/Paper'

import InputForm from '../../components/InputForm'
import Results from '../../components/Results'
import './style.css'

class Content extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            location: null
        };
        this.timer = null;
        window.content = this;
    }

    handleLocation = (location) => {
        this.setState({location})
    }

    render(){
        const {location} = this.state;
        let style = {
            maxWidth: location === null ? '800px' : '1000px',
        }
        return (
            <div className="paper-container">
                <Paper 
                    className='paper'
                    style={style}>
                    {location === null ?
                        <InputForm 
                            handleLocation={this.handleLocation}
                            />
                    :
                        <Results
                            location={location}
                            handleBack={() => this.handleLocation(null)}/>
                    }
                </Paper>
            </div>
        );
    }
}

export default Content;