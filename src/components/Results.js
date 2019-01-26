import React from 'react'
import Button from '@material-ui/core/Button'
import { Tooltip, LinearProgress } from '@material-ui/core';
import BackIcon from '@material-ui/icons/Close'
import axios from 'axios'

import ResultTable from './ResultTable'
// import NetworkView from './NetworkView'

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
    },
    back: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '5px'
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
            columns: [],
            parameters: {}
        }
        window.results = this;
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount = () => {
        this.timer = setInterval(() => this.poll(), 1000);
    }

    poll = () => {
        axios.get(this.props.location)
            .then(res => {
                if (res.data.hasOwnProperty('status')){
                    if (res.data['status'] === 'processing' || res.data['status'] === 'submitted') {
                        return;
                    }
                }
                
                let response = res.data;
                if (response.hasOwnProperty('result')){
                    this.handleResponse(response)
                }
            }).catch(error => {
                clearInterval(this.timer)
                this.props.handleBack()
                alert(error.stack)
            })
    }

    handleResponse= response => {
        clearInterval(this.timer)
        let result = response["result"];
        let parameters = response["parameters"];
        let columns = result['resultkey'];
        let resultvalue = result["resultvalue"];

        let data = Object.keys(resultvalue).map(key => {
            const row = {id: key};
            for (var i = 0; i < columns.length; i++)
                row[columns[i]] = resultvalue[key][i];
            return row;
        })

        this.setState({ data, columns, parameters })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleDelete() {
        var index = this.props.location;
        this.props.handleDelete(index);
    }

    render() {
        const { data, columns } = this.state;
        if (this.props.location === null){
            return (<div>
                <p>Unkown location: {this.props.location})...</p>
                </div>);
        }
        const id = this.props.location.substring(this.props.location.lastIndexOf("/") + 1);
        return (data === null ? 
            <div>
                <p>Waiting for result (task UUID: '{id}')</p>
                <LinearProgress />
                <a href="/" style={styles.back}><BackIcon /></a>
            </div>
            :
            <ResultInfo data={data} columns={columns} handleBack={this.props.handleBack}/>            
        );
    }
}

function ResultInfo(props) {
    const {
        // ndex,
        data, 
        columns,
        handleBack} = props;

    const column_arr = columns.map(name => {
        return { id: name, numeric: true, disablePadding: true, label: name }
    })

    column_arr.splice(0, 0, {id: 'id', numeric: false, disablePadding: true, label: "Name"})

    return (
    <div>
        {/* <NetworkView
            data={data}
        /> */}


        <ResultTable
            data={data}
            columns={column_arr} 
            orderBy="finalheat"
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
