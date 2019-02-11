import React from 'react'
import Button from '@material-ui/core/Button'
import { Tooltip, LinearProgress } from '@material-ui/core';
import BackIcon from '@material-ui/icons/Close'
import axios from 'axios'

import ResultTable from './ResultTable'
import NetworkView from './NetworkView'

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

const COLUMN_MAP = {
    negativelog: 'Gene Input Heat',
    finalheat: 'Final Heat'
}

const TOP_N = 20;

function downloadAsCsv(columns, data){
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
                clearInterval(this.timer)

                // console.log(res)
                let response = res.data;
                if (response.hasOwnProperty('result')){
                    this.handleResponse(response)
                }else{
                    throw new Error("No 'result' in " + JSON.stringify(response));
                }
            }).catch(error => {
                clearInterval(this.timer)
                this.props.handleBack()
                alert(error.stack)
            })
    }

    handleResponse= response => {
        let result = response["result"];
        let parameters = response["parameters"];
        let columns = result['resultkey'];
        let resultvalue = result["resultvalue"];
        let ndex = parameters['ndex']

        // Map column names to something prettier
        columns = columns.map(a => COLUMN_MAP[a]).filter(a => a !== undefined)

        // Organize data in readable manner: {id:, col1:, col2:}
        let data = Object.keys(resultvalue).map(key => {
            const row = {id: key};
            for (var i = 0; i < columns.length; i++)
                row[columns[i]] = resultvalue[key][i];
            return row;
        })

        data.sort((a, b) => b[COLUMN_MAP['finalheat']] - a[COLUMN_MAP['finalheat']])
        let topNodes = data.slice(0, TOP_N)
        let searchString = topNodes.map(a => a['id']).join(' ')

        this.setState({ data, columns, parameters, searchString, ndex })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleDelete() {
        var index = this.props.location;
        this.props.handleDelete(index);
    }

    render() {
        const { data, columns, searchString, ndex } = this.state;
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
            <div className="results">
                <NetworkView
                    ndex={ndex}
                    searchString={searchString}
                    />
                <ResultInfo 
                    data={data} 
                    columns={columns}/>
                <ButtonBar 
                    handleDownload={() => downloadAsCsv(data)}
                    handleBack={this.props.handleBack} />         
            </div>
        );
    }
}

const ResultInfo = (props) => {
    const {
        data, 
        columns} = props;

    const column_arr = columns.map(name => {
        return { id: name, numeric: true, disablePadding: true, label: name }
    })

    column_arr.splice(0, 0, {id: 'id', numeric: false, disablePadding: true, label: "Name"})

    return (
        <ResultTable
            data={data}
            columns={column_arr} 
            orderBy={COLUMN_MAP['finalheat']}
          />
    );
}

const ButtonBar = ({handleBack, handleDownload}) => {
    return (<div>
        <Tooltip title="All results will be lost. Be sure to export the data!" placement="top">
            <Button variant="contained" onClick={() => {
                if (window.confirm("All results will be lost. Be sure to export your data to CSV or NDEx! \n Continue?")) {
                    handleBack()
                }
            }}>Back
                </Button>
        </Tooltip>
        <Button variant="contained" style={styles.floatRight} onClick={handleDownload}>
            Export to CSV
            </Button>

        <Tooltip title="Coming Soon!" placement="top">
            <span style={styles.floatRight}>
                <Button variant="contained" color="primary" disabled>
                    View on NDEx
                    </Button>
            </span>
        </Tooltip>
    </div>)
}

export default Results;
