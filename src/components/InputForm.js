import React from 'react'
import { TextField, FormControl, Select, MenuItem, InputLabel,
    Button, CardHeader, ExpansionPanel, ExpansionPanelSummary, 
    Typography, FormHelperText } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import data from '../data'


const styles = {
    header: {
        padding: '4px 6px 4px 6px',
        marginBottom: '20px',
    },
    run_button: {
        float: 'right',
        marginRight: '15px',
        marginBottom: '15px'
    },
    form: {
        overflow: 'auto',
        padding: '10px',
        position: 'relative'
    },
    snp_input: {
        display: 'none'
    },
    row: {
        marginBottom: '20px',
        marginLeft: '30px',
        marginRight: '30px',

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
    },
    subheader: {
        backgroundColor: '#fafafa',
        padding: '2px 6px 2px 6px',
    },
    sample_button: {
        margin: '2px'
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
                        label={data.text.window}
                        helperText={data.help.window}
                        value={props.window}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>
                <Row>
                    <TextField
                        name="alpha"
                        label={data.text.alpha}
                        helperText={<span>
                            {data.help.alpha}
                            <br />
                            If unset, then optimal parameter is selected by linear model derived from <a href="https://www.cell.com/cell-systems/fulltext/S2405-4712(18)30095-4">(Huang, Cell Systems 2018)</a>
                        </span>}
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
            ...data.defaults};
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleFileChange = (file) => {
        this.setState({snp_level_summary: file})
    }

    validate = (formData) => {
        try {

            const ndex = formData.get('ndex')
            if (ndex.length !== 36){
                throw new Error("NDEx UUID is invalid")
            }
            
            const snp = this.file_input.files[0];
            if (snp === undefined){
                throw new Error("No SNP Level Summary provided.")
            }
            formData.append('snp_level_summary', this.file_input.files[0])
            
            const alpha = formData.get('alpha')
            if (alpha === '') {
                formData.delete('alpha')
            }else{
                formData.set('alpha', parseFloat(alpha))
            }

            const window = formData.get('window')
            formData.set('window', parseInt(window))
        } catch(e){
            alert(e.message)
            return null
        }
        return formData;
    }

    onSubmit = (event) => {
        event.preventDefault();
        
        
        const formData = new FormData(event.target);
        const valid_data = this.validate(formData);
        if (valid_data === null){

            return;
        }
        this.props.handleSubmit(valid_data)        
    }

    componentDidMount(){

    }

    runSample = () => {
        const MY_URL = "/nagadata/schizophrenia.txt"
        var request = new XMLHttpRequest();
        request.open('GET', MY_URL, true);
        request.responseType = 'blob';
        request.onload = function () {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload = function (e) {
                console.log('DataURL:', e.target.result);
            };
        };
        request.send();
    }

    render(){
        const {
            ndex,
            protein_coding,
            window,
            alpha
        } = this.state;

        const subheader = <div style={styles.subheader}>
            <p>{data.subheader}</p>
           
            <p>To generate the sample results{/* as in <a href={data.url.publication}>the publication</a>*/}
            , use the <a href={data.url.sample_file}>sample schizophrenia GWAS summary statistics</a>.
            Use <code>{data.sample_ndex}</code> as the NDEx network, and set the protein coding to hg18.
            Or click below to view the sample output</p>
            <Button
                style={styles.sample_button}
                onClick={this.runSample}>
                Schizophrenia Example
            </Button>
        </div>

        return (
            <form style={styles.form} onSubmit={this.onSubmit}>
                <CardHeader
                    style={styles.header}
                    title={data.title}
                    subheader={subheader}/>
                <Row>
                    <input
                        ref={v => { this.file_input = v }}
                        accept="text/*"
                        id="snp_level_summary"
                        style={styles.snp_input}
                        onChange={(e) => this.handleFileChange(e.target.files[0])}
                        type="file"
                    />
                    <label htmlFor="snp_level_summary">
                        <Button variant="contained" component="span" >
                            {data.text.snp_level_summary}
                        </Button>
                    </label>
                    {this.file_input !== undefined &&
                        this.file_input.files[0] !== undefined &&
                        <label style={styles.file_info}>
                            File Uploaded ({formatBytes(this.file_input.files[0].size)})
                        </label>
                    }
                    <FormHelperText>{data.help.snp_level_summary}</FormHelperText>
                </Row>
                <Row>
                    <TextField
                        name="ndex"
                        label={data.text.ndex}
                        helperText={data.help.ndex}
                        value={ndex}
                        onChange={this.handleChange}
                        fullWidth
                    />
                </Row>
                <Row>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="protein_coding">{data.text.protein_coding}</InputLabel>
                        <Select
                            name="protein_coding"
                            value={protein_coding}
                            onChange={this.handleChange}
                            
                        >
                            <MenuItem value="hg18">hg18</MenuItem>
                            <MenuItem value="hg19">hg19</MenuItem>
                        </Select>
                        <FormHelperText>{data.help.protein_coding}</FormHelperText>
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
                    <Button color="primary"
                        variant="contained" 
                        style={styles.run_button} 
                        type="submit"
                        >
                        Run Analysis<ArrowForwardIcon/>
                    </Button>
                </Row>
            </form>
        )
    }
}

export default InputForm;