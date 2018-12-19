import React from 'react'
import Paper from '@material-ui/core/Paper'
import InputForm from './InputForm'
import Results from './Results'

const styles = {
    paper: {
        width: '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '10px',
        alignContent: 'center',
        marginBottom: '20px',
        minWidth: '600px'
    },
    disclaimer: {
        marginTop: '4px',
        marginBottom: '4px',
        textAlign: 'center'
    }
}

class Content extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            location: null,
            ndex: null
        };
        this.timer = null;
    }

    handleLocation = (location, ndex) => {
        this.setState({location, ndex})
    }

    componentDidMount(){
    }

    render(){
        const {location, ndex} = this.state;
        let paperStyle = {
            maxWidth: location === null ? '800px' : 'none', 
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
                            ndex={ndex}
                            handleBack={() => this.handleLocation(null)}/>
                    }
                </Paper>
                <Paper style={{backgroundColor: '#ffdddd', ...paperStyle}}>
                    <p style={styles.disclaimer}>
                        NOTE: This service is experimental. The interface is subject to change.<br />
                        See <a href="https://github.com/shfong/nbgwas">https://github.com/shfong/nbgwas</a> for details and to report issues.
                    </p>
                </Paper>
            </div>
        );
    }
}

export default Content;