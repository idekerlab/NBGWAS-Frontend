import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from'@material-ui/core/Button'

import styles from './styles'
import form_data from '../data';

const NavBar = (props) => {
    const {classes} = props;
    return (
        <div>
            <AppBar position="static">
                
                <Toolbar>
                    <Typography variant="title" className={classes.grow} color="inherit">
                        NBGWAS Service
                    </Typography>
                    <Button
                        href={form_data.github}
                        color="inherit">Github</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}
export default withStyles(styles)(NavBar);