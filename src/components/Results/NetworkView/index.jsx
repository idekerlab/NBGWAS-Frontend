import React from 'react'
import axios from 'axios'
import CytoscapeComponent from 'react-cytoscapejs'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'

import DATA from '../../../assets/data'

import NetworkToolbar from './NetworkToolbar'

import './style.css'

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

function makeNodeAttributes(nodes, geneList) {
    const geneMap = {}
    geneList.forEach((gene, i) => {
        gene.finalrank = i + 1
        geneMap[gene.id] = gene;
    })

    const nodesFiltered = nodes.filter(node => node['n'] in geneMap)
    
    const heat_attrs = nodesFiltered.map(node => {
        return  {
            "po": node['@id'],
            "n": 'finalheat',
            "v":  geneMap[node['n']][DATA.columns['finalheat']],
            "d": "double"
        };
    });
    const rank_attrs = nodesFiltered.map(node => {
        return {
            "po": node['@id'],
            "n": 'finalrank',
            "v": geneMap[node['n']].finalrank,
            "d": "integer"
        };
    })
    return [...heat_attrs, ...rank_attrs];
}

const getNodeFillMapping = (name, min, max) => {
    return [
        {
            "properties_of": "nodes:default",
            "properties": {
                "NODE_TRANSPARENCY": "255",
                "NODE_FILL_COLOR": "#CCCCCC",
                "NODE_SELECTED_PAINT": "#00A0CA"
            },
            "mappings": {
                "NODE_FILL_COLOR": {
                    "type": "CONTINUOUS",
                    "definition": "COL=" + name + ",T=integer,L=0=#FF0000,E=0=#FF0000,G=0=#FF0000,OV=0=" + min + ",L=1=#FFFFFF,E=1=#FFFFFF,G=1=#FFFFFF,OV=1=" + max
                }
            }
        },
        {
            "properties_of": "edges:default",
            "properties": {
                "EDGE_LINE_TYPE": "SOLID",
                "EDGE_PAINT": "#323232",
                "EDGE_SELECTED_PAINT": "#FF0000",
                "EDGE_SOURCE_ARROW_SELECTED_PAINT": "#FFFF00",
                "EDGE_SOURCE_ARROW_SHAPE": "NONE",
                "EDGE_SOURCE_ARROW_UNSELECTED_PAINT": "#000000",
                "EDGE_STROKE_SELECTED_PAINT": "#FF0000",
                "EDGE_STROKE_UNSELECTED_PAINT": "#848484",
                "EDGE_TARGET_ARROW_SELECTED_PAINT": "#FFFF00",
                "EDGE_TARGET_ARROW_SHAPE": "NONE",
                "EDGE_TARGET_ARROW_UNSELECTED_PAINT": "#000000",
                "EDGE_UNSELECTED_PAINT": "#404040",
            },
            "dependencies": {
                "arrowColorMatchesEdge": "false"
            }
        },
    ]
}

function cleanup(network, geneList){
    let modifiedNetwork = network;
    // modifiedNetwork = modifiedNetwork.filter(aspect => Object.keys(aspect)[0] !== 'cyVisualProperties');
    // Update metaData: cyVisualProperties += 2, update/add nodeAttributes
    const nodeAspects = modifiedNetwork.filter(aspect => Object.keys(aspect)[0] === 'nodes').map(asp => asp['nodes'])
    const nodes = [].concat(...nodeAspects)
    console.log("Network has " + nodes.length + " nodes")
    const nodeAttributes = makeNodeAttributes(nodes, geneList);
    console.log("Adding " + nodeAttributes.length + " attributes")
    modifiedNetwork.splice(2, 0, { nodeAttributes })

    console.log("Adding CyVis")
    const name = "finalrank"
    const vals = nodeAttributes.filter(attr => attr['n'] === name).map(attr => attr['v'])
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const cyVisualProperties = getNodeFillMapping(name, min, max);
    modifiedNetwork.splice(-2, 0, { cyVisualProperties })
    console.log("Done")

    // window.network = modifiedNetwork;
    return modifiedNetwork;
}

class NetworkView extends React.Component {
    initialTopN = 20
    constructor(props){
        super(props);
        this.state = {
            network: null,
            searchString: '',
            loading: false,
            genes: props.genes.sort((a, b) => b[DATA.columns['finalheat']] - a[DATA.columns['finalheat']]),
        }
        this.doPreview = this.doPreview.bind(this);
    }

    onPreview = (num) => {
        if (this.state.loading){
            return;
        }
        this.setState({loading: true})
        this.doPreview(num)
    }

    componentDidMount = () => {
        this.onPreview(this.initialTopN)
    }

    async doPreview(num) {
        const { ndex } = this.props;
        const { genes } = this.state;
        
        const geneList = genes.slice(0, num)
        const searchString = geneList.map(a => 'nodeName:"' + a.id + '"').join(' OR ')
        const ndex_url = DATA.url.ndex_query.replace('{networkid}', ndex)
        const body = {
            searchString,
            searchDepth: 1,
            edgeLimit: 50000,
            errorWhenLimitIsOver: true,
            // directOnly: true,
        };

        axios.post(ndex_url, body)
            .then(resp => {
                const network = cleanup(resp.data, genes);
                
                const niceCX = utils.rawCXtoNiceCX(network)
                if (niceCX === null){
                    throw new Error("Failed to convert raw CX to niceCX: " + JSON.stringify(network))
                }

                const elements = cx2js.cyElementsFromNiceCX(niceCX, {})
                const style = cx2js.cyStyleFromNiceCX(niceCX, {})

                // Clear style and nodes/edges
                window.cy.elements().remove()
                window.cy.style()

                // Load network outside of react state?
                window.cy.add(elements)
                window.cy.style(style)
                const layout = window.cy.layout({'name': 'grid'})
                layout.run();
                
                this.setState({network, searchString, loading: false})
            })
            .catch(e => {
                alert(e);
                this.setState({ loading: false })
            })
    }

    render(){
        const {
            network,
            loading
        } = this.state;


        return (
        <div
            className="cytoscape-container">
            <CytoscapeComponent
                className="cytoscape-component"
                elements={[]}
                stylesheet={[]}
                cy={cy => {
                    window.cy = cy
                }}
            />
            <NetworkToolbar 
                network={network}
                onPreview={this.onPreview}
                initialTopN={this.initialTopN}
                loading={loading}
            />
        </div>
        );
    }
}

export default NetworkView;