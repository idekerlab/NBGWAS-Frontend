import React from 'react'
import styles from './styles'
import { withStyles } from '@material-ui/core/styles';


function NetworkView(props) {
    const {classes} = props;
    return (
    <div className={classes.networkView}>
        Network View Here
    </div>
    );
}

export default withStyles(styles)(NetworkView);