import React from 'react'
import { TextField, FormControl, Select, MenuItem, InputLabel,
    Button, CardHeader, FormHelperText, LinearProgress } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Tooltip from '@material-ui/core/Tooltip';

import axios from 'axios'

import Row from './Row'
import AdvancedPanel from './AdvancedPanel'
import FileUpload from './FileUpload'

import config from '../../assets/config'
import './style.css'

/**
 * author: Brett Settle
 * 
 * InputForm component for entering parameters to be passed to NAGA REST API
 * Results must be submitted as a form. Once a request is submitted, the task ID
 * is propagated up to the parent container, and the tab is switched to Results
 */

class InputForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            complete: 0,
            running: false,
            disablerunbtn: true,
            runbutntooltip: config.tooltips.run_button_disabled,
            ...config.defaults};

        this.file_input = null;
    }

    handleChange = event => {
        var disablerunbtn = true
        var runbutntooltip = config.tooltips.run_button_disabled
        var ndexval = this.state.ndex
        if (event.target.name === 'ndex'){
            ndexval = event.target.value
        }
        if (ndexval !== undefined && ndexval !== null &&
            ndexval.length >= 36){
            if (this.state.snp_level_summary !== undefined &&
                this.state.snp_level_summary !== null){
                    disablerunbtn = false
                    runbutntooltip = config.tooltips.run_button_enabled
            }
        }

        this.setState({[event.target.name]: event.target.value,
                      'disablerunbtn': disablerunbtn,
                      'runbutntooltip': runbutntooltip})
    }

    handleClick = event => {
        event.preventDefault();
        var disablerunbtn = true
        var runbutntooltip = config.tooltips.run_button_disabled
        if (this.state.snp_level_summary !== undefined &&
            this.state.snp_level_summary !== null){
                disablerunbtn = false
                runbutntooltip = config.tooltips.run_button_enabled
        }
        this.setState({ ndex: config.sample_ndex,
                        'disablerunbtn': disablerunbtn,
                        'runbutntooltip': runbutntooltip})
    }

    runSample = (event) => {
        event.preventDefault();
        this.props.handleLocation(config.url.sample_results)
    }

    validate = (formData) => {
        try {
            const snp = this.state.snp_level_summary;
            if (snp === undefined){
                throw new Error("No SNP Level Summary provided.")
            }
            formData.append('snp_level_summary', snp)
            
            const ndex = formData.get('ndex')
            if (ndex.length !== 36) {
                throw new Error("NDEx UUID is invalid")
            }

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
        const callbacks = {
            onUploadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.setState({ running: true, complete: percentCompleted })
            }
        }
        
        axios.post(config.url.endpoint, formData, callbacks)
            .then(res => {
                if (res['data'] === 'failed') {
                    console.log(res)
                    this.setState({ running: false })
                    return;
                }

                this.props.handleLocation(res.headers['location'])
            })
            .catch(error => {
                window.err = error
                alert(error.stack)
                this.setState({ running: false })

            })
    }

    handleFileUpload = (f) => {
        var disrunbtn = true
        var runtooltip = config.tooltips.run_button_disabled
        if (f !== undefined && f !== null &&
            this.state.ndex !== undefined &&
            this.state.ndex !== null &&
            this.state.ndex.length >= 36){
            disrunbtn = false
            runtooltip = config.tooltips.run_button_enabled
        }
        this.setState({snp_level_summary: f,
            'disablerunbtn': disrunbtn,
            'runbutntooltip': runtooltip})
    }

    render(){
        const {
            ndex,
            snp_level_summary,
            protein_coding,
            window,
            alpha,
            complete,
            running,
            disablerunbtn,
            runbutntooltip
        } = this.state;

        const pubLink = config.url.publication && <span> as in <a href={config.url.publication}>the publication</a></span>

        const subheader = <div className='subheader'>
            <p>{config.subheader}</p>
            <p>To generate the sample results{pubLink}, use this provided <a href={config.url.sample_file}>example file of schizophrenia GWAS summary statistics</a>.
            Use the sample NDEx network, and set the protein coding to hg18.</p>
        </div>

        const ndex_help = <span>
            The UUID of the reference network on <a href="http://www.ndexbio.org">NDEx</a>. For example, to use the Parsimonious Composite Network (PCNet), one would use this: <a href="/" onClick={this.handleClick}>{config.sample_ndex}</a>
        </span>

        if (running === true){
            return (<div>
                <p>Submitting task...</p>
                <LinearProgress variant="determinate" value={complete} />
            </div>)
        }

        return (
            <form className='form' onSubmit={this.onSubmit}>
                <CardHeader
                    className='header'
                    title={config.title}
                    subheader={subheader}/>
                <FileUpload 
                    sampleURL={config.url.sample_file}
                    text={config.text.snp_level_summary}
                    help={config.help.snp_level_summary}
                    onChange={this.handleFileUpload}
                    name="snp_level_summary"
                    value={snp_level_summary}
                />
                <Row>
                    <TextField
                        name="ndex"
                        label={config.text.ndex}
                        helperText={ndex_help}
                        value={ndex}
                        onChange={this.handleChange}
                        fullWidth
                    />
                </Row>
                <Row>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="protein_coding">{config.text.protein_coding}</InputLabel>
                        <Select
                            name="protein_coding"
                            value={protein_coding}
                            onChange={this.handleChange}>
                            {config.protein_codings.map((a, b) => {
                                return <MenuItem key={b} value={a.path}>{a.name}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>{config.help.protein_coding}</FormHelperText>
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
                    <p className='button-bar-text'>
                        <a href="/" onClick={this.runSample}>Example output</a> (schizophrenia on hg18)
                    </p>
                    <Tooltip title={runbutntooltip} placement='left-start'>
                        <span className='run-button-tooltip'>
                            <Button 
                                color="primary"
                                variant="contained" 
                                className='run-button'
                                disabled={disablerunbtn}
                                type="submit"
                                >
                                {config.text.run}<ArrowForwardIcon/>
                            </Button>
                        </span>
                    </Tooltip>
                </Row>
            </form>
        )
    }
}

export default InputForm;