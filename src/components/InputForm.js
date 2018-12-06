import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button'

import {CustomUpload, NDExUpload, BiggimUpload} from './InputTypes'
import AdvancedSettings from './AdvancedSettings';
import form_data from '../data'
import styles from './styles'

class InputForm extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            uploadType: 'sampleA',
            customUpload: null,
            ndex: 'http://dev2.ndexbio.org/#/network/5f3a589b-e91e-11e8-ad43-0660b7976219',
            column: 'weight',
            goldStandard: '',
            top: 100,
            alpha: 0.2
        }
    }

    getSampleNetwork = async (file) => {
        const url = '/samples/' + file;
        let blob = await fetch(url).then (res => res.blob());
        return blob;
    };

    pFileReader(file) {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();
            fr.onload = resolve;  // CHANGE to whatever function you want which would eventually call resolve
            fr.readAsDataURL(file);
        });
    }

    getNDExNetwork = async (ndex, column) => {
        const ndex_url = new URL(ndex)
        const server = ndex_url.host
        const uuid = ndex_url.hash.substring(ndex_url.hash.lastIndexOf('/') + 1)
        const url = `/getThreeColumn?server=${server}&uuid=${uuid}&column=${column}`;
        let blob = await fetch(url).then(res => res.blob());
        return blob;
    }

    getNetwork = (uploadType) => {
        const {customUpload, ndex, column} = this.state;
        if (uploadType === 'sampleA'){
            return this.getSampleNetwork('3col_interactions260.csv');
        }else if (uploadType === 'custom') {
            return new Promise(function(resolve, reject) {
                resolve(customUpload);
            });
        } else if (uploadType === 'ndex') {
            return this.getNDExNetwork(ndex, column);
        }
    }

    checkParameters = (formData) => {
        let { top, goldStandard, column, uploadType } = this.state;        

        if (formData.get('alpha') === ''){
            formData.set('alpha', .2);
        }
        formData.set('seeds', ['SEPT7'])

        if (uploadType === 'biggim'){
            formData.set('column', column)
            this.props.handleRun(formData, goldStandard, top);
            return;
        }
        
        this.getNetwork(uploadType)
        .then(blob => {
            formData.set('network', blob)
            this.props.handleRun(formData, goldStandard, top);
        })
    }

    handleChange = name => event => {
        if (name === 'customUpload'){
            if (event.target.files.length === 1){
                console.log(event.target.files[0])
                this.setState({customUpload: event.target.files[0]})
            }
            return;
        }
        this.setState({ [name]: event.target.value });
    };

    onSubmit = (event) => {
        const data = new FormData(this.form)
        this.checkParameters(data)
    }

    render(){
        const { classes } = this.props;
        const { uploadType, 
            customUpload, 
            ndex,
            column,
            goldStandard, 
            top,
            alpha
        } = this.state;

        return (
            <Card className={classes.card}>
                <CardHeader
                    title={form_data.title}
                    subheader={form_data.subheader} 
                />
                <form
                    ref={r => { this.form = r }}
                    // onSubmit={this.handleSubmit} 
                    id="nbgwas_form">
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">{form_data.uploadType}</FormLabel>
                        <RadioGroup
                            aria-label="Upload Type"
                            id="uploadType"
                            className={classes.group}
                            value={this.state.uploadType}
                            onChange={this.handleChange('uploadType')}
                        >
                            <FormControlLabel value="sampleA" control={<Radio />} label="Sample A" />
                            <FormControlLabel value="biggim" control={<Radio />} label="Biggim" />
                            {uploadType === 'biggim' && 
                                <BiggimUpload
                                    column={column}
                                    handleChange={this.handleChange}/>
                            }
                            <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                            {uploadType === 'custom' && 
                                <CustomUpload
                                    customUpload={customUpload}
                                    handleChange={this.handleChange}/>
                            }
                            <FormControlLabel value="ndex" control={<Radio />} label="NDEx UUID" />
                            {uploadType === 'ndex' &&
                                <NDExUpload
                                    ndex={ndex}
                                    handleChange={this.handleChange}/>
                            }
                        </RadioGroup>
                    </FormControl>
                    <AdvancedSettings 
                        goldStandard={goldStandard}
                        top={top}
                        alpha={alpha}
                        handleChange={this.handleChange}
                    />
                    <FormControl className={classes.buttonBar}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            onClick={this.onSubmit}
                        >
                            {form_data.runText}
                        </Button>
                    </FormControl>
                </form>
            </Card>
        )
    }
}
InputForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputForm);