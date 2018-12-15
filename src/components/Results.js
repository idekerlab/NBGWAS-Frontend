import React from 'react'
import Button from '@material-ui/core/Button'
import ResultTable from './ResultTable'
import NetworkView from './NetworkView'
import { Tooltip, LinearProgress } from '@material-ui/core';
import axios from 'axios'

const styles = {
    floatRight: {
        float: 'right',
        marginLeft: '10px'
    },
    closeButton: {
        float:'right'
    },
    errorBox: {
        background: '#ff000020',
        paddingLeft: '7px'
    }
}

function downloadAsCsv(data){
    var csv = 'Name,Final Heat\n';
    data.forEach(function (row) {
        csv += row['id'] + ',' + row['heat'];
        csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'output.csv';
    hiddenElement.click();
}

class Results extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
        }

        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount = () => {
        this.timer = setInterval(() => this.poll(), 1000);
    }

    poll = () => {
        axios.get(this.props.location)
            .then(res => {
                if (res.data.hasOwnProperty('status') && res.data['status'] === 'processing') {
                    return;
                }
                console.log(res)
                this.handleData(res.data['result'])
            }).catch(error => {
                clearInterval(this.timer)
                alert(error.stack)
                this.props.handleBack()
            })
    }

    handleData = data => {
        clearInterval(this.timer)
        let rows = Object.keys(data).map(key => {
            return { id: key, heat: data[key] }
        })

        window.rows = rows;
        this.setState({ data: rows })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleDelete() {
        var index = this.props.location;
        this.props.handleDelete(index);
    }

    render() {
        const { data } = this.state;
        const id = this.props.location.substring(this.props.location.lastIndexOf("/") + 1);
        return (data === null ? 
            <div>
                <p>Waiting for result (task UUID: {id})...</p>
                <LinearProgress />
            </div>
            :
            <ResultInfo data={data} handleBack={this.props.handleBack}/>            
        );
    }
}

function ResultInfo(props) {
    const {data, handleBack} = props;

    return (
    <div>
        <NetworkView/>

        <ResultTable
            data={data}
            columns={[
                { id: 'id', numeric: false, disablePadding: true, label: 'Name' },
                { id: 'heat', numeric: true, disablePadding: false, label: 'Final Heat' }]}
          />
        <div>
            <Tooltip title="All results will be lost. Be sure to export the data!" placement="top">
                <Button variant="contained" onClick={() => {  
                    if (window.confirm("All results will be lost. Be sure to export your data to CSV or NDEx! \n Continue?")){
                        handleBack()
                    }
                }}>Back
                </Button>
            </Tooltip>
            <Button variant="contained" style={styles.floatRight} onClick={() => downloadAsCsv(data)}>
                Export to CSV
            </Button>

            <Tooltip title="Coming Soon!" placement="top">
                <span style={styles.floatRight}>
                    <Button variant="contained" color="primary" disabled>
                        View on NDEx
                    </Button>
                </span>
            </Tooltip>
        </div>
    </div>
    );
}

export default Results;