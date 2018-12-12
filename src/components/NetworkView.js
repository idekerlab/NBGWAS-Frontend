import React from 'react'

const styles = {
    networkView: {
        border: '2px solid black',
        width: '100%',
        height: '500px'
    }
}

function NetworkView(props) {
    return (
    <div style={styles.networkView}>
        Network View Here
    </div>
    );
}

export default NetworkView;