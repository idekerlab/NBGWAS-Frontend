import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import form_data from '../data'
import styles from './styles'


function AdvancedSettings(props) {
    const { classes, 
        goldStandard, 
        top, 
        alpha,
        handleChange } = props;
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Advanced Settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="gold-standard"></InputLabel>
                    <TextField
                        id="gold-standard"
                        label={form_data.goldStandardText}
                        className={classes.textField}
                        value={goldStandard}
                        onChange={handleChange('goldStandard')}
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
                        onChange={handleChange('top')}
                        margin="normal"
                        type="number"
                    />
                    <FormHelperText>{form_data.topHelp}</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="alpha"></InputLabel>
                    <TextField
                        name="alpha"
                        id="alpha"
                        label={form_data.alphaText}
                        className={classes.textField}
                        value={alpha}
                        onChange={handleChange('alpha')}
                        margin="normal"
                        inputProps={{ step: .1, min: .0, max: 1 }}
                        type="number"
                    />
                    <FormHelperText>{form_data.alphaHelp}</FormHelperText>
                </FormControl>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

AdvancedSettings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdvancedSettings);