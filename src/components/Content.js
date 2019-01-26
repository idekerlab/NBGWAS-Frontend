import React from 'react'
import Paper from '@material-ui/core/Paper'

import InputForm from './InputForm'
import Results from './Results'

const styles = {
    paper: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '10px',
        alignContent: 'center',
        marginBottom: '20px',
        minWidth: '800px',
        position: 'relative'
    },
    disclaimer: {
        marginTop: '4px',
        marginBottom: '4px',
        textAlign: 'center'
    }
}


function WarningBar({paperStyle}) {
    return (
        <Paper style={{ backgroundColor: '#ffdddd', ...paperStyle }}>
            <p style={styles.disclaimer}>
                NOTE: This service is experimental. The interface is subject to change.<br />
                See <a href="https://github.com/shfong/nbgwas">https://github.com/shfong/nbgwas</a> for details and to report issues.
                    </p>
        </Paper>
    );
}

class Content extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            location: null,
        };
        this.timer = null;
        window.content = this;
    }

    handleLocation = (location) => {
        this.setState({location})
    }

    render(){
        const {location} = this.state;
        let paperStyle = {
            maxWidth: location === null ? '800px' : '1000px', 
            ...styles.paper};
        return (
            <div>
                <Paper style={{marginTop: '100px', ...paperStyle}}>
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

                <WarningBar paperStyle={paperStyle} />
            </div>
        );
    }
}

export default Content;