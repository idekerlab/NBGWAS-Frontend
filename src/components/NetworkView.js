import React from 'react'
import axios from 'axios'

const styles = {
    networkView: {
        border: '2px solid black',
        width: '100%',
        height: '500px'
    }
}

class NetworkView extends React.Component {
    componentDidMount(){
        const values = this.props.data;

        axios.get('http://ndexbio.org/v2/network/' + this.props.ndex)
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }

    render(){
        return (
        <div style={styles.networkView}>
            Network View Here
        </div>
        );
    }
}

export default NetworkView;