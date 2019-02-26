import React from 'react'
import axios from 'axios'

import { Toolbar, Button, Typography, CircularProgress } from '@material-ui/core';

import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import SearchIcon from '@material-ui/icons/Search'
import OpenInCytoscapeIcon from '../../../../assets/images/open_in_cytoscape.png'

import NDExSaveModal from './NDExSaveModal'
import LayoutMenu from './LayoutMenu'
import ColorLegend from './ColorLegend';
import NDExSignInButton from './NDExSignInButton'
import DATA from '../../../../assets/data';
import './style.css'


const openInCytoscape = (cx) => {
    axios.post(DATA.url.open_in_cytoscape, cx, {
        'Content-Type': 'application/json'
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
            profile: null,
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

    onLoginSuccess = (profile) => {
        this.setState({ profile })
    }

    render(){
        const {
            cytoscape_running,
            topN, 
            profile,
        } = this.state;

        const {
            network
        } = this.props

        const cytoscape_img_cls = cytoscape_running ? '' : 'btn-disabled';

        return (
        <Toolbar
            className='cytoscape-toolbar'>
            {profile && 
                <NDExSaveModal 
                    profile={profile}
                    cx={network}
                    handleClose={() => this.setState({profile: null})}
                />
            }
            <div className="cytoscape-toolbar-group exporters">
                <button 
                    disabled={!cytoscape_running}
                    onClick={() => {
                        if (cytoscape_running){
                            openInCytoscape(network)
                        }
                    }}>
                        <img className={cytoscape_img_cls} src={OpenInCytoscapeIcon} alt="Open in Cytoscape" />
                </button>
                
                <NDExSignInButton 
                    onSuccess={this.onLoginSuccess}
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