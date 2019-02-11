import React from 'react'

import CytoscapeComponent from 'react-cytoscapejs'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'
import './style.css'
import data from '../../../assets/data';

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)


function makeNodeAttributes(nodes, geneList){
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

/**
 * Simple wrapper for the Cytoscape viewer
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const CytoscapeViewer = props => {
    const {network, geneList} = props;

    if (network === null || network === undefined) {
        return null
    }

    const nodes = network.filter(aspect => Object.keys(aspect)[0] === 'nodes')[0]['nodes']
    network.push({ nodeAttributes: makeNodeAttributes(nodes, geneList) })
    network.push({ cyVisualProperties: getNodeFillMapping()})
    const niceCX = utils.rawCXtoNiceCX(network)
    console.log('NICE ===', niceCX)

    
    const attributeNameMap = {}
    const elements = cx2js.cyElementsFromNiceCX(niceCX, attributeNameMap)
    const style = cx2js.cyStyleFromNiceCX(niceCX, attributeNameMap)

    console.log('CYJS ===', elements, style)

    const elementsArray = [...elements.nodes, ...elements.edges]

    return (
        <CytoscapeComponent
            className="cytoscape-component"
            elements={elementsArray}
            layout={{ name: 'cose' }}
            style={{ width: '100%', height: '100%' }}
            stylesheet={style}
            cy={props.cy}
        />
    )
}

export default CytoscapeViewer
