import React from 'react'
import axios from 'axios'
import {Button, Menu, MenuItem} from '@material-ui/core'
import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'

import data from '../../../assets/data'
import './style.css'

import CytoscapeViewer from '../CytoscapeViewer'

const url = 'http://www.ndexbio.org/v2/search/network/{networkid}/interconnectquery?save=false'

const CytoscapeToolbar = () => {
    return (
        <div className="cytoscape-toolbar">
            <Button
                onClick={() => {window.cy.fit(20) }}>
                <AspectRatioIcon />
            </Button>
            <ExportMenu />
            <LayoutMenu />
        </div>
    )
}

class ExportMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = (layout) => {
        this.setState({ anchorEl: null });
    };

    openInCytoscape = () => {
        this.handleClose();
    }
    openInNDEx = () => {
        this.handleClose();
    }

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <OpenInNewIcon />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.openInCytoscape}>Cytoscape</MenuItem>
                    <MenuItem onClick={this.openInNDEx}>NDEx</MenuItem>

                </Menu>
            </div>
        );
    }
}
class LayoutMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    LAYOUTS = {
        'Random': {'name': 'random'},
        'Circle': {'name': 'circle'},
        'Grid': {'name': 'grid'},
        'Concentric': {'name': 'concentric'},
        'Breadthfirst': {'name': 'breadthfirst'},
        'Cose': {'name': 'cose'}
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = (layout) => {
        if (layout.hasOwnProperty('name')){
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

function makeNodeAttributes(nodes, geneList) {
    const nodeMap = {}
    nodes.forEach(node => {
        nodeMap[node['n']] = node['@id']
    })

    const attrs = geneList.map(gene => {
        const id = nodeMap[gene['id']];
        return {
            "po": id,
            "n": 'finalheat',
            "v": gene[data.columns['finalheat']],
            "d": "double"
        }
    })
    return attrs;
}

const getNodeFillMapping = () => {
    return [
        {
            "properties_of": "nodes:default",
            "properties": {
                "NODE_TRANSPARENCY": "100",
                "NODE_FILL_COLOR": "#00FF00",
                "NODE_SELECTED_PAINT": "#A000CA"
            },
            "mappings": {
                "NODE_FILL_COLOR": {
                    "type": "CONTINUOUS",
                    "definition": "COL=finalheat,T=double,L=0=#0066CC,E=0=#FFFFFF,G=0=#FFFFFF,OV=0=0,L=1=#FF0000,E=1=#FF0000,G=1=#FFFF00,OV=1=20.058"
                }
            }
        }
    ]
}

function cleanup(network, geneList){
    const unstyledNetwork = network;//.filter(aspect => Object.keys(aspect)[0] !== 'cyVisualProperties')
    const nodes = unstyledNetwork.filter(aspect => Object.keys(aspect)[0] === 'nodes')[0]['nodes']
    unstyledNetwork.push({ nodeAttributes: makeNodeAttributes(nodes, geneList) })
    unstyledNetwork.push({ cyVisualProperties: getNodeFillMapping() })
    return unstyledNetwork;
}

class NetworkView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            network: null,
            geneList: []
        }
    }

    componentWillMount(){
        const { ndex, geneList } = this.props;
        const searchString = geneList.map(a => a.id).join(' ')
        const ndex_url = url.replace('{networkid}', ndex)
        axios.post(ndex_url, { searchString })
        .then(resp => {
            const network = cleanup(resp.data, geneList);
            console.log(network)
            this.setState({network, geneList})
        });
    }

    render(){
        const {
            network,
            geneList
        } = this.state;

        return (
        <div
            className="cytoscape-container">
            <CytoscapeToolbar />
            <CytoscapeViewer
                network={network}
                geneList={geneList}
            />
        </div>
        );
    }
}

export default NetworkView;