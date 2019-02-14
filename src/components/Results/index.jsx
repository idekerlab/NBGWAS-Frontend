import React from 'react'
import Button from '@material-ui/core/Button'
import { Tooltip, LinearProgress } from '@material-ui/core';
import BackIcon from '@material-ui/icons/Close'
import axios from 'axios'

import DATA from '../../assets/data'
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

function downloadAsCsv(columns, data){
    
    var csv = "Name," + columns.join(",") + "\n";
    const lines = data.map(row => {
        const rowInfo = columns.map(name => row[name]);
        return row['id'] + ',' + rowInfo.join(',');
    });
    csv += lines.join("\n")
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
            parameters: {},
            ndex: null
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
        columns = columns.map(a => DATA.columns[a]).filter(a => a !== undefined)
        // Organize data in readable manner: {id:, col1:, col2:}
        let data = Object.keys(resultvalue).map((key, n) => {
            const row = {id: key};
            for (var i = 0; i < columns.length; i++)
                row[columns[i]] = resultvalue[key][i];
            return row;
        })

        this.setState({ data, columns, parameters, ndex })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleDelete() {
        var index = this.props.location;
        this.props.handleDelete(index);
    }

    rowClick = (event, name) => {
        const node = window.cy.elements('node[name = "' + name + '"]');
        alert(JSON.stringify(node.data(), null, 2))
        //window.cy.elements().unselect()
        //.select()
    }

    render() {
        const { data, columns, ndex } = this.state;
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
                    genes={data}
                    />
                <ResultInfo 
                    data={data}
                    columns={columns}
                    handleClick={this.rowClick}/>
                <ButtonBar 
                    handleDownload={() => downloadAsCsv(columns, data)}
                    handleBack={this.props.handleBack} />         
            </div>
        );
    }
}

const ResultInfo = (props) => {
    const {
        data, 
        columns,
        handleClick} = props;

    const column_arr = columns.map(name => {
        return { id: name, numeric: true, disablePadding: true, label: name }
    })

    column_arr.splice(0, 0, {id: 'id', numeric: false, disablePadding: true, label: "Name"})

    return (
        <ResultTable
            data={data}
            columns={column_arr} 
            orderBy={DATA.columns['finalheat']}
            handleClick={handleClick}
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
    </div>)
}

export default Results;
