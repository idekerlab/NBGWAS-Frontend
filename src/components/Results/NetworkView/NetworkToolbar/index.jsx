import React from 'react'
import axios from 'axios'

import { Toolbar, Button, Typography, CircularProgress } from '@material-ui/core';

import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import SearchIcon from '@material-ui/icons/Search'

import LayoutMenu from './LayoutMenu'
import ColorLegend from './ColorLegend';
import NDExSignInButton from './NDExSignInButton'
import DATA from '../../../../assets/data';
import './style.css'

// const NDEX_LOAD_NETWORK = 'http://ndexbio.org/v2/network'

const openInCytoscape = (cx) => {
    axios.post(DATA.url.open_in_cytoscape, cx, {
        'Content-Type': 'application/json'
    })
        .then(resp => {
            console.log(resp)
        })
}

const openInNDEx = (auth, cx) => {
    axios.post(DATA.url.open_in_ndex, cx, { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        }
    })
    .then(resp => {
        console.log(resp)
    })
}

const searchPortal = () => {
    alert("Opening portal search")
}

class NetworkToolbar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cytoscape_running: false,
            topN: props.initialTopN || 10,
        }
    }

    async pollCytoscape() {
        axios.get(DATA.url.poll_cytoscape)
        .then(resp => {
            this.setState({cytoscape_running: resp.status === 200})
        }).catch(e => {
            // Ignore error
        })
    }

    componentDidMount() {
        this.interval = setInterval(() => this.pollCytoscape(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value})
    }

    render(){
        const {
            cytoscape_running,
            topN
        } = this.state;

        const {
            network
        } = this.props

        return (
        <Toolbar
            className='cytoscape-toolbar'>
            <div className="cytoscape-toolbar-group exporters">
                {cytoscape_running &&
                    <button 
                    style={{color: "orange"}}
                        onClick={() => openInCytoscape(network)}>
                        <OpenInNewIcon />
                    </button>
                }
                <NDExSignInButton 
                        onLoginSuccess={(auth) => openInNDEx(auth, network)}
                />
                
                <button onClick={searchPortal}><SearchIcon /></button>
            </div>
            <div className="toolbar-separator" />
            <div className="cytoscape-toolbar-group network-tools">
                <button onClick={() => window.cy.fit(20)}><AspectRatioIcon /></button>
                <LayoutMenu />
            </div>
            <div className="grow" />

            <ColorLegend />
            <div className="toolbar-separator" />
            <div className="cytoscape-toolbar-group naga">
                <div className="cytoscape-toolbar-input">
                    <label htmlFor="topN">Top Nodes:</label>
                    <input
                        name="topN"
                        id="topN"
                        type="number"
                        value={topN} 
                        min={0}
                        max={500}
                        onChange={this.handleChange}/>
                </div>
                <Button disabled={this.props.loading} onClick={() => this.props.onPreview(topN)}>
                    {this.props.loading ?
                        <CircularProgress size={20}/>:
                        <Typography>Preview</Typography>
                    }
                </Button>
            </div>
        </Toolbar>)
    }
}

export default NetworkToolbar;