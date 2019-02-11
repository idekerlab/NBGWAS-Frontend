import React from 'react'
import axios from 'axios'
import CytoscapeViewer from '../CytoscapeViewer'

const url = 'http://www.ndexbio.org/v2/search/network/{networkid}/interconnectquery?save=false'


// Names of top n, join with ' ', run query, load CX in viewer
class NetworkView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            network: null
        }
    }

    componentDidMount(){
        const { ndex, searchString } = this.props;
        const ndex_url = url.replace('{networkid}', ndex)
        // const values = this.props.data;
        axios.post(ndex_url, { searchString })
        .then(resp => {
            const network = resp.data;
            this.setState({network})
        });
    }

    mounted(cy){
        window.cy = cy;
    }

    render(){
        const {network} = this.state;
        return (
        <CytoscapeViewer
            network={network}
            cy={this.mounted}
        />
        );
    }
}

export default NetworkView;