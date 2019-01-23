import React from 'react'
import { TextField, FormControl, Select, MenuItem, InputLabel,
    Button, CardHeader, FormHelperText, LinearProgress } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import axios from 'axios'
import Row from './Row'
import AdvancedPanel from './AdvancedPanel'
import FileUpload from './FileUpload'

import data from '../data'


const styles = {
    header: {
        padding: '4px 6px 4px 6px',
        marginBottom: '20px',
    },
    run_button: {
        float: 'right',
    },
    form: {
        overflow: 'auto',
        padding: '10px',
        position: 'relative'
    },
    subheader: {
        backgroundColor: '#fafafa',
        padding: '2px 6px 2px 6px',
    }
}

class InputForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            complete: 0,
            running: false,
            ...data.defaults};

        this.file_input = null;
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    runSample = (event) => {
        event.preventDefault()
        this.props.handleLocation(data.url.sample_results, data.sample_ndex)
    }


    validate = (formData) => {
        try {
            const ndex = formData.get('ndex')
            if (ndex.length !== 36){
                throw new Error("NDEx UUID is invalid")
            }

            const snp = this.state.snp_level_summary;
            if (snp === undefined){
                throw new Error("No SNP Level Summary provided.")
            }
            formData.append('snp_level_summary', snp)
            
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
        this.handleSubmit(valid_data)        
    }

    handleSubmit = (formData) => {
        const config = {
            onUploadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.setState({ running: true, complete: percentCompleted })
            }
        }
        
        axios.post(data.url.endpoint, formData, config)
            .then(res => {
                if (res['data'] === 'failed') {
                    console.log(res)
                    this.setState({ running: false })
                    return;
                }

                this.props.handleLocation(res.headers['location'], formData.get('ndex'))
            })
            .catch(error => {
                window.err = error
                alert(error.stack)
                this.setState({ running: false })

            })
    }

    render(){
        const {
            ndex,
            snp_level_summary,
            protein_coding,
            window,
            alpha,
            complete,
            running
        } = this.state;

        const subheader = <div style={styles.subheader}>
            <p>{data.subheader}</p>
           
            <p>To generate the sample results{/* as in <a href={data.url.publication}>the publication</a>*/}
            , use this provided <a href={data.url.sample_file}>example file of schizophrenia GWAS summary statistics</a>.
            Use the sample NDEx network, and set the protein coding to hg18.</p>
        </div>

        const ndex_help = <span>
            <span>{data.help.ndex} </span>For example, to use the Parsimonious Composite Network (PCNet), one would use this: <a href="/" onClick={(event) => {
               event.preventDefault();
               this.setState({ndex: data.sample_ndex})
           }}>{data.sample_ndex}</a>
        </span>

        if (running === true){
            return (<div>
                <p>Submitting task...</p>
                <LinearProgress variant="determinate" value={complete} />
            </div>)
        }

        return (
            <form style={styles.form} onSubmit={this.onSubmit}>
                <CardHeader
                    style={styles.header}
                    title={data.title}
                    subheader={subheader}/>
                <FileUpload 
                    onChange={(f) => this.setState({snp_level_summary: f})}
                    name="snp_level_summary"
                    value={snp_level_summary}
                    // ref={comp => {
                    //     this.file_input = comp
                    // }}
                />
                <Row>
                    <TextField
                        name="ndex"
                        label={data.text.ndex}
                        helperText={ndex_help}
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
                            onChange={this.handleChange}>
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
                    <p style={{float: 'left', fontSize: '14px'}}>
                        <a href="/" onClick={this.runSample}>Example output</a> (schizophrenia on hg18)
                    </p>
                    <Button color="primary"
                        variant="contained" 
                        style={styles.run_button} 
                        type="submit"
                        >
                        {data.text.run}<ArrowForwardIcon/>
                    </Button>
                </Row>
            </form>
        )
    }
}

export default InputForm;