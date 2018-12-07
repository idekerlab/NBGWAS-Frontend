import React from 'react'

import data from '../data'
import { TextField, FormControl, Select, MenuItem, InputLabel,
    Button, CardHeader, ExpansionPanel, ExpansionPanelSummary, 
    Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Fab from '@material-ui/core/Fab';

const styles = {
    run_button: {
        float: 'right',
        marginRight: '15px',
        marginBottom: '15px'
    },
    form: {
        overflow: 'auto',
        padding: '10px'
    },
    snp_input: {
        display: 'none'
    },
    row: {
        marginBottom: '20px'
    },
    advanced_content: {
        padding: '20px'
    }
}

const Row = (props) => {
    return (
        <div style={styles.row}>
            {props.children}
        </div>
    )
}

const AdvancedPanel = (props) => {
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Settings</Typography>
            </ExpansionPanelSummary>
            <div style={styles.advanced_content}>
                <Row>
                    <TextField
                        name="window"
                        type="number"
                        label={data.window_text}
                        helperText={data.window_help}
                        value={props.window}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>
                <Row>
                    <TextField
                        name="alpha"
                        label={data.alpha_text}
                        helperText={data.alpha_help}
                        value={props.alpha}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>
            </div>
      </ExpansionPanel >
    )
}

class InputForm extends React.Component {
    constructor(props){
        super(props)
        this.state = data.form;
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    render(){
        const {
            ndex,
            protein_coding,
            snp_level_summary,
            window,
            alpha
        } = this.state;
        return (
            <form style={styles.form} onSubmit={this.props.handleRun}>
                <CardHeader
                    title={data.title}
                    subheader={data.subheader}/>
                <Row>
                    <TextField
                        name="ndex"
                        label={data.ndex_text}
                        helperText={data.ndex_help}
                        value={ndex}
                        onChange={this.handleChange}
                        fullWidth
                    />
                </Row>

                <Row>
                    <input
                        accept="text/*"
                        id="snp_level_summary"
                        style={styles.snp_input}
                        value={snp_level_summary}
                        onChange={this.handleChange}
                        type="file"
                    />
                    <label htmlFor="snp_level_summary">
                        <Button variant="contained" component="span">
                            {data.snp_level_summary_text}
                        </Button>
                    </label>
                </Row>
                <Row>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="protein_coding">{data.protein_coding_text}</InputLabel>
                        <Select
                            name="protein_coding"
                            value={protein_coding}
                            onChange={this.handleChange}
                        >
                            <MenuItem value="hg18">hg18</MenuItem>
                            <MenuItem value="hg19">hg19</MenuItem>
                        </Select>
                    </FormControl>
                </Row>
                    <AdvancedPanel 
                        window={window}
                        alpha={alpha}
                        handleChange={this.handleChange}
                    />
                <Row>

                </Row>

                <Fab color="primary" style={styles.run_button}>
                    <ArrowForwardIcon/>
                </Fab>
            </form>
        )
    }
}

export default InputForm;