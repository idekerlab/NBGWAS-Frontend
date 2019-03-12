import React from 'react'
import axios from 'axios'
import OpenInCytoscapeIcon from './assets/images/open_in_cytoscape.png'
import CONFIG from './assets/config'

export default class OpenInCytoscapeButton extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            cytoscape_running: false,
        }
        this.interval = setInterval(() => this.pollCytoscape(), 5000);
    }

    openInCytoscape = () => {
        const {network} = this.props
        axios.post(CONFIG.cyrest_import, network, {
            'Content-Type': 'application/json'
        })
            .then(resp => {
                console.log(resp)
            })
    }

    async pollCytoscape() {
        axios.get(CONFIG.poll_cytoscape)
            .then(resp => {
                this.setState({ cytoscape_running: resp.status === 200 })
            }).catch(e => {
                this.setState({ cytoscape_running: false })
            })
    }

    componentWillUnmount() {
        if (this.interval){
            clearInterval(this.interval);
        }
    }

    render(){
        const {
            cytoscape_running
        } = this.state;

        const {
            network
        } = this.props
        
        const cytoscape_img_cls = cytoscape_running ? '' : 'btn-disabled';

        const help_message = cytoscape_running ?
            "Open this network in the Cytoscape Desktop Application" :
            "To open this network in Cytoscape, you must have a local instance of the application running with CyREST open on port 1234"

        return (
        <button
            disabled={!cytoscape_running}
            title={help_message}
            onClick={() => {
                if (cytoscape_running) {
                    this.openInCytoscape(network)
                }
            }}>
            <img className={cytoscape_img_cls} src={OpenInCytoscapeIcon} alt="Open in Cytoscape" />
        </button>);
    }
}