import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'

import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

import form_data from '../data'
import styles from './styles'

class InputForm extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            uploadType: 'sampleA',
            customUpload: null,
            ndex: '',
            goldStandard: '',
            top: 100,
            alpha: 0.2
        }
    }

    getNetwork = () => {
        const {uploadType} = this.state;
        if (uploadType === 'sampleA'){
            return 'SAMPLE A';
        }else if (uploadType === 'custom') {
            return this.state.customUpload;
        } else if (uploadType === 'ndex') {
            return this.state.ndex;
        }
    }

    checkParameters = () => {
        let {
            goldStandard,
            top,
            alpha
        } = this.state;

        alpha = alpha.length === 0 ? .2 : parseFloat(alpha);
        const network = this.getNetwork();

        this.props.handleRun({
            network,
            alpha,
            goldStandard,
            top
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
        console.log(name + " " + event.target.value)
        this.setState({ [name]: event.target.value });
    };

    render(){
        const { classes } = this.props;
        const { uploadType, 
            customUpload, 
            ndex, 
            goldStandard, 
            top,
            alpha
        } = this.state;

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        title={form_data.title}
                        subheader={form_data.subheader} 
                    />
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">{form_data.uploadType}</FormLabel>
                        <RadioGroup
                            aria-label="Upload Type"
                            name="uploadType"
                            className={classes.group}
                            value={this.state.uploadType}
                            onChange={this.handleChange('uploadType')}
                        >
                            <FormControlLabel value="sample A" control={<Radio />} label="Sample A" />
                            <FormControlLabel value="sample B" control={<Radio />} label="Sample B" />
                            <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                            <FormControlLabel value="ndex" control={<Radio />} label="NDEx UUID" />
                            
                        </RadioGroup>
                    </FormControl>
                    {uploadType === 'custom' &&
                        <FormControl className={classes.formControl}>
                            <input
                                accept="text/*"
                                className={classes.input}
                                id="custom-upload"
                                type="file"
                                onChange={this.handleChange('customUpload')}
                            />
                            <label htmlFor="custom-upload">
                                <Button variant="contained" component="span" className={classes.button}>
                                    {form_data.uploadButtonText}
                                </Button>
                                {customUpload && <Typography component='p'>
                                    {customUpload.name} {customUpload.size}b
                                </Typography>}
                            </label>
                        </FormControl>
                    }
                    {uploadType === 'ndex' && 
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="ndex-entry"></InputLabel>
                            <TextField
                                required
                                id="ndex-entry"
                                label={form_data.ndexText}
                                className={classes.textField}
                                value={ndex}
                                onChange={this.handleChange('ndex')}
                                margin="normal"
                            />
                        </FormControl>
                    }
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="gold-standard"></InputLabel>
                        <TextField
                            id="gold-standard"
                            label={form_data.goldStandardText}
                            className={classes.textField}
                            value={goldStandard}
                            onChange={this.handleChange('goldStandard')}
                            margin="normal"
                        />
                        <FormHelperText>{form_data.goldStandardHelp}</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="top"></InputLabel>
                        <TextField
                            id="top"
                            label={form_data.topText}
                            className={classes.textField}
                            value={top}
                            onChange={this.handleChange('top')}
                            margin="normal"
                            type="number"
                        />
                        <FormHelperText>{form_data.topHelp}</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="alpha"></InputLabel>
                        <TextField
                            id="alpha"
                            label={form_data.alphaText}
                            className={classes.textField}
                            value={alpha}
                            onChange={this.handleChange('alpha')}
                            margin="normal"
                            inputProps={{step : .1, min: .0, max: 1}}
                            type="number"
                        />
                        <FormHelperText>{form_data.alphaHelp}</FormHelperText>
                    </FormControl>
                    <CardActions>
                        <Button 
                            variant="contained" 
                            className={classes.button} 
                            onClick={this.checkParameters}>
                            {form_data.runText}
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}
InputForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputForm);