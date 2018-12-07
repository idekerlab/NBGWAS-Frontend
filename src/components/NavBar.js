import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import data from '../data';

const NavBar = (props) => {
    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="title" style={{flexGrow: 1}} color="inherit">
                        NBGWAS Service
                    </Typography>
                    <Button
                        href={data.swagger}
                        color="inherit">Swagger API</Button>
                    <Button
                        href={data.github}
                        color="inherit">Github</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}
export default NavBar;