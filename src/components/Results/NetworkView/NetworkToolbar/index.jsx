import React from 'react'
import axios from 'axios'

import { Toolbar } from '@material-ui/core';

import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import SearchIcon from '@material-ui/icons/Search'

import LayoutMenu from './LayoutMenu'
import './style.css'

const POLL_CYTOSCAPE = 'http://localhost:1234/v1'

const CYREST_LOAD_NETWORK = 'http://localhost:1234/cyndex2/v1/networks/cx'
// const NDEX_LOAD_NETWORK = 'http://ndexbio.org/v2/network'

const openInCytoscape = (cx) => {
    axios.post(CYREST_LOAD_NETWORK, cx, {
        'Content-Type': 'application/json'
    })
        .then(resp => {
            console.log(resp)
        })
}

const openInNDEx = (cx) => {
    alert("Open in NDEx. Possible?")
    // axios.post(NDEX_LOAD_NETWORK, cx, {
    //     'Content-Type': 'application/json'
    // })
    //     .then(resp => {
    //         console.log(resp)
    //     })
}

const searchPortal = () => {
    alert("Opening portal search")
}

class NetworkToolbar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cytoscape_running: false
        }
    }

    pollCytoscape = () => {
        axios.get(POLL_CYTOSCAPE)
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

    render(){
        const {
            cytoscape_running
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
                <button onClick={() => openInNDEx(network)}><OpenInNewIcon /></button>
                <button onClick={searchPortal}><SearchIcon /></button>
            </div>
            <div className="toolbar-separator" />
            <div className="cytoscape-toolbar-group network-tools">
                <button onClick={() => window.cy.fit(20)}><AspectRatioIcon /></button>
                <LayoutMenu />
            </div>
            <div className="grow" />
            <div className="cytoscape-toolbar-group left naga">
                <div className="cytoscape-toolbar-input">
                    <label htmlFor="topN">Top N Nodes:</label>
                    <input
                        name="topN"
                        id="topN"
                        type="number"
                        value={this.props.topN} 
                        min={0}
                        max={300}
                        onChange={(ev) => this.props.handleChange("topN", ev.target.value)}/>
                </div>
            </div>
        </Toolbar>)
    }
}

export default NetworkToolbar;