/* author: Brett Settle

Useful functions for updating a CX network with the resutls of a NAGA run.
Currently, this adds nodeAttributes for 'finalheat' and 'finalrank' as well
as a cyVisualProperties element for styling the network from white to red
by finalrank
*/
import DATA from '../assets/data'


function makeNodeAttributes(nodes, geneList) {
    const geneMap = {}
    geneList.forEach((gene, i) => {
        gene.finalrank = i + 1
        geneMap[gene.id] = gene;
    })

    const nodesFiltered = nodes.filter(node => node['n'] in geneMap)

    const heat_attrs = nodesFiltered.map(node => {
        return {
            "po": node['@id'],
            "n": 'finalheat',
            "v": geneMap[node['n']][DATA.columns['finalheat']],
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

/**
 * Apply the genelist results to the CX network. This is useful for adding style, attribtues, and other
 * aspects that will be included when the network is exported as CX, or before it is translated to CyJS
 */
export function apply(network, geneList) {
    let modifiedNetwork = network;
    // modifiedNetwork = modifiedNetwork.filter(aspect => Object.keys(aspect)[0] !== 'cyVisualProperties');
    
    const nodeAspects = modifiedNetwork.filter(aspect => Object.keys(aspect)[0] === 'nodes').map(asp => asp['nodes'])
    const nodes = [].concat(...nodeAspects)
    console.log("Network has " + nodes.length + " nodes")
    const nodeAttributes = makeNodeAttributes(nodes, geneList);
    console.log("Adding " + nodeAttributes.length + " attributes")
    modifiedNetwork.splice(-3, 0, { nodeAttributes })

    console.log("Adding CyVis")
    const name = "finalrank"
    const vals = nodeAttributes.filter(attr => attr['n'] === name).map(attr => attr['v'])
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const cyVisualProperties = getNodeFillMapping(name, min, max);
    modifiedNetwork.splice(-2, 0, { cyVisualProperties })
    console.log("Done")
    
    modifiedNetwork = modifiedNetwork.filter(aspect => Object.keys(aspect)[0] !== 'metaData');
    const metaDataObj = {};
    modifiedNetwork.forEach(aspect => {
        
        const name = Object.keys(aspect)[0]
        const info = { name };
        if (['nodes', 'networkAttributes', 'nodeAttributes', 'edgeAttributes', 'edges'].indexOf(name) >= 0){
            const vals = metaDataObj[name] || {elementCount: 0, idCounter: 0}
            info['elementCount'] = vals['elementCount'] + aspect[name].length
            info['idCounter'] = vals['idCounter'] + Math.max(...aspect[name].map(asp => asp['@id']))
        }
        metaDataObj[name] = info;
    })
    const metaData = Object.keys(metaDataObj).map(name => {
        return {name, ...metaDataObj[name]}
    })
    modifiedNetwork.splice(1, 0, {metaData})

    window.network = modifiedNetwork;
    return modifiedNetwork;
}