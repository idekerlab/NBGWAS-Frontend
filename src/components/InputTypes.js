import React from 'react'
import { withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel';

import form_data from '../data'
import styles from './styles'

function CustomInput (props){
    const {customUpload, handleChange, classes} = props;

    return (<FormControl className={classes.formControl}>
        <input
            accept="text/csv"
            className={classes.input}
            id="custom-upload"
            type="file"
            onChange={handleChange('customUpload')}
        />
        <label htmlFor="custom-upload">
            <Button
                variant="contained"
                component="span"
                style={{ float: 'none' }}
                className={classes.button}>
                {form_data.uploadButtonText}
            </Button>
            {customUpload && <Typography component='p'>
                {customUpload.name} {customUpload.size}b
                                </Typography>}
        </label>
    </FormControl>
    );
}

function NDExInput(props){
    const { ndex, handleChange, classes } = props;
    return (
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="ndex-entry"></InputLabel>
            <TextField
                required
                id="ndex-entry"
                label={form_data.ndexText}
                className={classes.textField}
                value={ndex}
                onChange={handleChange('ndex')}
                margin="normal"
            />
        </FormControl>
    );
}

function BiggimInput(props){
    const {classes, column, handleChange} = props;
    return (<FormControl className={classes.formControl}>
        <InputLabel htmlFor="bigim-column-entry"></InputLabel>
        <TextField
            required
            id="bigim-column-entry"
            label="Bigim Attribute"
            className={classes.textField}
            value={column}
            onChange={handleChange('column')}
            margin="normal"
        />
    </FormControl>)
}

const CustomUpload = withStyles(styles)(CustomInput);
const NDExUpload = withStyles(styles)(NDExInput);
const BiggimUpload = withStyles(styles)(BiggimInput);


export { CustomUpload, NDExUpload, BiggimUpload };