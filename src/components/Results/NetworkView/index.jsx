import React from 'react'
import axios from 'axios'
import CytoscapeComponent from 'react-cytoscapejs'

import {apply} from '../../../api/apply_results'
import DATA from '../../../assets/data'
import NetworkToolbar from './NetworkToolbar'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'

import './style.css'

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

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
                const cxNetwork = apply(resp.data, genes);
                const niceCX = utils.rawCXtoNiceCX(cxNetwork)
                if (niceCX === null){
                    throw new Error("Failed to convert raw CX to niceCX: " + JSON.stringify(cxNetwork))
                }

                const elements = cx2js.cyElementsFromNiceCX(niceCX, {})
                const style = cx2js.cyStyleFromNiceCX(niceCX, {})

                // Clear style and nodes/edges
                window.cy.elements().remove()
                window.cy.style()

                // Load network outside of react state?
                window.cy.add(elements)
                window.cy.style(style)
                const layout = window.cy.layout({'name': 'cose'})
                layout.run();
                
                this.setState({network: cxNetwork, searchString, loading: false})
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