import React from 'react'
import {MenuItem, Button, Menu} from '@material-ui/core'


class LayoutMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    LAYOUTS = {
        'Random': { 'name': 'random' },
        'Circle': { 'name': 'circle' },
        'Grid': { 'name': 'grid' },
        'Concentric': { 'name': 'concentric' },
        'Breadthfirst': { 'name': 'breadthfirst' },
        'Cose': { 'name': 'cose' }
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = (layout) => {
        if (layout.hasOwnProperty('name')) {
            const lay = window.cy.layout(layout)
            lay.run();
        }
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;

        const items = Object.keys(this.LAYOUTS).map((name, id) => {
            return <MenuItem
                key={id}
                name={name}
                onClick={() => this.handleClose(this.LAYOUTS[name])}
            >{name}</MenuItem>
        })
        return (
            <div>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Layout
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {items}
                </Menu>
            </div>
        );
    }
}

export default LayoutMenu;