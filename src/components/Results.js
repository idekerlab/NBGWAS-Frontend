import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import styles from './styles'
import ResultTable from './ResultTable'
import NetworkView from './NetworkView'



function Results(props) {
    const {classes, data, handleBack} = props;
    return <Paper className={classes.card}>
        <NetworkView 
            data={data}    
        />
        <ResultTable
            data={data}
            columns={[
                { id: 'id', numeric: false, disablePadding: true, label: 'Name' },
                { id: 'value', numeric: true, disablePadding: false, label: 'Value' }]}
          />
        <div className={classes.buttonBar}>
            <Button variant="contained" style={{float: 'none'}} className={classes.button}
                onClick={handleBack}>
                Back
            </Button>

            <Button variant="contained" className={classes.button}>
                Export to CSV
            </Button>
            <Button variant="contained" color="primary" className={classes.button}>
                View on NDEx
            </Button>
        </div>

    </Paper>;
}

export default withStyles(styles)(Results)