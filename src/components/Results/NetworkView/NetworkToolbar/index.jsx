import React from 'react'
import axios from 'axios'

import { Toolbar, Button, Typography, CircularProgress, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import SearchIcon from '@material-ui/icons/Search'
import OpenInCytoscapeIcon from '../../../../assets/images/open_in_cytoscape.png'



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
            auth: "",
            ndexUrl: ""
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
            topN, 
            auth,
        } = this.state;

        const {
            network
        } = this.props

        const cytoscape_img_cls = cytoscape_running ? '' : 'btn-disabled';

        return (
        <Toolbar
            className='cytoscape-toolbar'>
            {auth && 
                <SaveToNDExModal 
                    auth={auth}
                    cx={network}
                    handleClose={() => this.setState({auth: null})}
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
                    onLoginSuccess={(auth) => this.setState({auth})}
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

class SaveToNDExModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            networkUrl: ""
        };
    }

    handleOpen = () => {
        // this.setState({ open: true });
    };

    handleClose = () => {
        this.props.handleClose()//setState({ open: false });
    };

    saveToNDEx = () => {
        const {auth, cx} = this.props;

        axios.post(DATA.url.open_in_ndex, cx, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
        })
            .then(resp => {
                const networkUrl = resp.data.replace("/v2/", "/#/")
                this.setState({networkUrl})
            })
    }

    render() {
        const {
            networkUrl
        } = this.state;

        return (
            <div>
                <Dialog
                    open={true}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            Now that you're logged in, you can save the network to your NDEx account
                        </DialogContentText>
                        <DialogActions>
                            {networkUrl ? 
                                <Button 
                                    href={networkUrl}
                                    target="_blank"
                                >
                                    Open in NDEx
                                </Button>
                            :
                                <Button
                                    onClick={this.saveToNDEx}
                                    >
                                    Save to my account
                                </Button>
                            }
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default NetworkToolbar;