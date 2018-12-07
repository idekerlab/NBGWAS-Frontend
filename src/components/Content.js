import React from 'react'

import Paper from '@material-ui/core/Paper'

import InputForm from './InputForm'
import Results from './Results'

const styles = {
    paper: {
        width: '60%',
        margin: 'auto',
        marginTop: '100px',
        padding: '10px',
        alignContent: 'center'
    }
}

class Content extends React.Component {
    constructor(props){
        super(props)
        this.state = {data: null};
    }

    handleRun(formData){
        console.log(formData);
    }

    render(){
        const {data} = this.state;
        const paperStyle = styles.paper;
        if (data === null){
            paperStyle.maxWidth = '800px'
        }
        return (
            <Paper style={paperStyle}>
                {data === null ?
                <InputForm 
                    handleRun={this.handleRun}
                    />
                :
                <Results 
                    data={data}
                    handleBack={() => this.setState({data: null})}
                />
                }
            </Paper>
        );
    }
}

export default Content;