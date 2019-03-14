import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import logo from '../../assets/images/naga logo.png'
import config from '../../assets/config';
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
                <a href="/">
                    <img className="logo" src={logo} alt="NAGA Logo" height="match-parent" />
                </a>
                <Typography variant="title" style={{flexGrow: 1}} color="inherit">
                    {config.title} <span className="version">v{config.version}</span>
                </Typography>
                <Button
                    href={config.url.data}
                    color="inherit">Sample Data</Button>
                <Button
                    href={config.url.swagger}
                    color="inherit">Swagger API</Button>
                <Button
                    href={config.url.github}
                    color="inherit">Github</Button>
            </Toolbar>
        </AppBar>
    )
}
export default NavBar;