import React from 'react'
import Button from '@material-ui/core/Button'
import ResultTable from './ResultTable'
import NetworkView from './NetworkView'



function Results(props) {
    const {data, handleBack} = props;
    return (
    <div>
        <NetworkView 
            data={data}    
        />
        <ResultTable
            data={data}
            columns={[
                { id: 'id', numeric: false, disablePadding: true, label: 'Name' },
                { id: 'value', numeric: true, disablePadding: false, label: 'Value' }]}
          />
        <div>
            <Button variant="contained" style={{float: 'none'}}
                onClick={handleBack}>
                Back
            </Button>

            <Button variant="contained">
                Export to CSV
            </Button>
            <Button variant="contained" color="primary">
                View on NDEx
            </Button>
        </div>
    </div>
    );
}

export default Results;