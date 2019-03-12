import React from 'react'
import { Toolbar, Button, Typography, CircularProgress } from '@material-ui/core';
import AspectRatioIcon from '@material-ui/icons/AspectRatio'

import OpenInCytoscapeButton from '../../OpenInCytoscapeButton'
import OpenInSearchButton from '../../GeneSearchButton'
import NDExSave from '../../NDExSave'
import NDExSignInModal from '../../NDExSignInModal'
import OpenInNDExButton from '../../OpenInNDExButton'

import LayoutMenu from './LayoutMenu'
import ColorLegend from './ColorLegend';

import './style.css'

class NetworkToolbar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            topN: props.topN || 25,
            profile: null,
            ndexModal: false
        }
    }

    componentDidMount = () => {
        this.props.onPreview(this.state.topN)
    }

    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value})
    }

    onLoginSuccess = (profile) => {
        this.setState({ profile })
    }

    onLogout = () => {
        this.setState({profile: null})
    }

    showNDExModal = () => {
        this.setState({ndexModal: true})
    }

    render(){
        const {
            topN, 
            profile,
            ndexModal
        } = this.state;

        const {
            network,
            geneNames
        } = this.props


        return (
        <Toolbar
            className='cytoscape-toolbar'>
            {ndexModal && 
                <NDExSignInModal 
                    profile={profile}
                    onLoginSuccess={this.onLoginSuccess}
                    onLogout={this.onLogout}
                    handleClose={() => this.setState({ndexModal: false})}
                >
                    <NDExSave 
                        cx={network}
                        profile={profile} />

                </NDExSignInModal>
            }
            <div className="cytoscape-toolbar-group exporters">
                <OpenInCytoscapeButton 
                    network={network}
                />
                <OpenInNDExButton 
                    onClick={this.showNDExModal}
                />
                <OpenInSearchButton
                    geneNames={geneNames}
                />
                
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
                <form className="cytoscape-toolbar-input"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            this.props.onPreview(topN)
                        }
                    }>
                    <label htmlFor="topN">Top Nodes:</label>
                    <input
                        name="topN"
                        id="topN"
                        type="number"
                        value={topN} 
                        min={0}
                        max={500}
                        onChange={this.handleChange}/>
                    <Button 
                        disabled={this.props.loading} 
                        type="submit">
                        {this.props.loading ?
                            <CircularProgress size={20} /> :
                            <Typography>Preview</Typography>
                        }
                    </Button>
                </form>
            </div>
        </Toolbar>)
    }
}

export default NetworkToolbar;