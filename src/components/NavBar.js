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
                        {data.title}
                    </Typography>
                    <Button
                        href={data.url.data}
                        color="inherit">Sample Data</Button>
                    <Button
                        href={data.url.swagger}
                        color="inherit">Swagger API</Button>
                    <Button
                        href={data.url.github}
                        color="inherit">Github</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}
export default NavBar;