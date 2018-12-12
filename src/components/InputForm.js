import React from 'react'
import { TextField, FormControl, Select, MenuItem, InputLabel,
    Button, CardHeader, ExpansionPanel, ExpansionPanelSummary, 
    Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Fab from '@material-ui/core/Fab';

import data from '../data'


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
    },
    file_info: {
        paddingLeft: '30px'
    },
    error: {
        color: 'red'
    },
    info: {
        color: 'black'
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
                <Typography>Advanced Settings (optional)</Typography>
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

function formatBytes(a, b) { if (0 === a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }


class InputForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            ...data.form};
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleFileChange = (file) => {
        this.setState({snp_level_summary: file})
    }

    validate = (data) => {
        try {

            const ndex = data.get('ndex')
            if (ndex.length !== 36){
                throw new Error("NDEx UUID is invalid")
            }
            
            const snp = this.file_input.files[0];
            if (snp === undefined){
                throw new Error("No SNP Level Summary provided.")
            }
            data.append('snp_level_summary', this.file_input.files[0])
            
            const alpha = data.get('alpha')
            if (alpha === '') {
                data.delete('alpha')
            }else{
                data.set('alpha', parseFloat(alpha))
            }

            const window = data.get('window')
            data.set('window', parseInt(window))
        } catch(e){
            alert(e.message)
            return null
        }
        return data;
    }

    onSubmit = (event) => {
        event.preventDefault();
        
        
        const formData = new FormData(event.target);
        const data = this.validate(formData);
        if (data === null){

            return;
        }
        this.props.handleSubmit(data)        
    }

    render(){
        const {
            ndex,
            protein_coding,
            window,
            alpha
        } = this.state;
        return (
            <form style={styles.form} onSubmit={this.onSubmit}>
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
                        ref={v => {this.file_input = v}}
                        accept="text/*"
                        id="snp_level_summary"
                        style={styles.snp_input}
                        onChange={(e) => this.handleFileChange(e.target.files[0])}
                        type="file"
                    />
                    <label htmlFor="snp_level_summary">
                        <Button variant="contained" component="span">
                            {data.snp_level_summary_text}
                        </Button>
                    </label>
                    {this.file_input !== undefined && 
                        this.file_input.files[0] !== undefined &&
                        <label style={styles.file_info}>
                            File Uploaded ({formatBytes(this.file_input.files[0].size)})
                        </label>
                        }
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
                <Row>
                    <AdvancedPanel 
                        window={window}
                        alpha={alpha}
                        handleChange={this.handleChange}
                    />
                </Row> 
                <Row>
                    <Fab color="primary" 
                        style={styles.run_button} 
                        type="submit"
                        >
                        <ArrowForwardIcon/>
                    </Fab>
                </Row>
            </form>
        )
    }
}

export default InputForm;