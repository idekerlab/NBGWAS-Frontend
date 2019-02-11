import React from 'react'
import axios from 'axios'
import './style.css'

import CytoscapeViewer from '../CytoscapeViewer'

const url = 'http://www.ndexbio.org/v2/search/network/{networkid}/interconnectquery?save=false'

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
            const network = resp.data;
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
            <CytoscapeViewer
                network={network}
                geneList={geneList}
            />
        </div>
        );
    }
}

export default NetworkView;