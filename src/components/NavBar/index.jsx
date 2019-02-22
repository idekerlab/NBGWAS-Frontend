import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import logo from '../../assets/images/naga logo.png'
import data from '../../assets/data';
import './style.css'

/**
 * author: Brett Settle
 * 
 * Static component for simple NavBar. Has no access to state or other components
 */

const NavBar = () => {
    return (
        <AppBar position="fixed">
            <Toolbar className="navbar">
                <img className="logo" src={logo} alt="NAGA Logo" height="match-parent" />
                <Typography variant="title" style={{flexGrow: 1}} color="inherit">
                    {data.title} <span className="version">v{data.version}</span>
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
    )
}
export default NavBar;