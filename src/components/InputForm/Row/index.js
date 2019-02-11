import React from 'react'

const styles = {
    row: {
        marginBottom: '20px',
        marginLeft: '15px',
        marginRight: '15px',

    },
}

const Row = (props) => {
    return (
        <div style={styles.row}>
            {props.children}
        </div>
    )
}

export default Row;