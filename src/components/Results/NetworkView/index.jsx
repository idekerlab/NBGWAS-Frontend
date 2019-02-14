import React from 'react'
import axios from 'axios'
import CytoscapeComponent from 'react-cytoscapejs'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'

import DATA from '../../../assets/data'

import NetworkToolbar from './NetworkToolbar'

import './style.css'

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

const NDEX_INTERCONNECT_URL = 'http://www.ndexbio.org/v2/search/network/{networkid}/interconnectquery?save=false'

function makeNodeAttributes(nodes, geneList) {

    const geneMap = {}
    geneList.forEach((gene, i) => {
        gene.rank = i + 1
        geneMap[gene.id] = gene;
    })
    const attrs = [];
    nodes.forEach(node => {
        const gene = geneMap[node['n']] || {rank: -1, [DATA.columns['finalheat']]: 0};

        const heat_attr = {
            "po": node['@id'],
            "n": 'finalheat',
            "v":  gene[DATA.columns['finalheat']],
            "d": "double"
        }
        const rank_attr = {
            "po": node['@id'],
            "n": 'finalrank',
            "v": gene.rank,
            "d": "integer"
        }
        attrs.push(heat_attr, rank_attr)
    })
    return attrs;
}


const getNodeFillMapping = (min, max) => {
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
                    "definition": "COL=finalheat,T=double,L=0=#0066CC,E=0=#FFFFFF,G=0=#FFFFFF,OV=0=" + min + ",L=1=#FF0000,E=1=#FF0000,G=1=#FFFF00,OV=1=" + max
                }
            }
        }
    ]
}

function cleanup(network, geneList){
    const vals = geneList.map(gene => gene[DATA.columns['finalheat']])
    const min = Math.min(...vals)
    const max = Math.max(...vals)

    const unstyledNetwork = network;//.filter(aspect => Object.keys(aspect)[0] !== 'cyVisualProperties')
    console.log("Getting nodes")
    const nodes = unstyledNetwork.filter(aspect => Object.keys(aspect)[0] === 'nodes')[0]['nodes']
    console.log("Making node attributes")
    unstyledNetwork.splice(2, 0, { nodeAttributes: makeNodeAttributes(nodes, geneList) })
    console.log("Adding CyVis")
    unstyledNetwork.splice(-2, 0, { cyVisualProperties: getNodeFillMapping(min, max) })
    console.log("Done")
    return unstyledNetwork;
}

class NetworkView extends React.Component {
    MAX_GENES = 200;
    constructor(props){
        super(props);
        this.state = {
            network: null,
            searchString: '',
            topN: 0,
        }
    }

    componentWillMount(){
        const { ndex, genes } = this.props;
        // IMPORTANT: Sort the genes by finalheat
        genes.sort((a, b) => b[DATA.columns['finalheat']] - a[DATA.columns['finalheat']])
        
        const geneList = genes.slice(0, this.MAX_GENES)
        const searchString = geneList.map(a => a.id).join(' ')
        const ndex_url = NDEX_INTERCONNECT_URL.replace('{networkid}', ndex)
        axios.post(ndex_url, { searchString })
            .then(resp => {
                const network = cleanup(resp.data, geneList);
                
                const niceCX = utils.rawCXtoNiceCX(network)
                if (niceCX === null){
                    throw new Error("Failed to convert raw CX to niceCX: " + JSON.stringify(network))
                }
                const elements = cx2js.cyElementsFromNiceCX(niceCX, {})
                const style = cx2js.cyStyleFromNiceCX(niceCX, {})

                // Load network outside of react state?
                window.cy.add(elements)
                window.cy.style(style)
                const layout = window.cy.layout({'name': 'grid'})
                layout.run();

                const topN = geneList.length
                this.setState({network, searchString, topN})
            })
            .catch(e => {
                alert(e);
            })
    }

    handleChange = (name, val) => {

        this.setState({[name]: val})

        if (name === 'topN' && !Number.isNaN(Number.parseInt(val))){
            window.cy.elements('node[finalrank <= ' + val + ']').show()
            window.cy.elements('node[finalrank > ' + val + ']').hide()
        }
    }

    render(){
        const {
            network,
            topN
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
                topN={topN}
                handleChange={this.handleChange}
            />
        </div>
        );
    }
}

export default NetworkView;