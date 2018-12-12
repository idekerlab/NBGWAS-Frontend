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
    var csv = 'Name,Value\n';
    data.forEach(function (row) {
        csv += row['id'] + ',' + row['value'];
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
            return { id: key, value: data[key] }
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
        return (<div>
            <p>Result at <a href={this.props.location}>{this.props.location}</a></p>
            {data === null ? 
                <LinearProgress />
                :
                <ResultInfo data={data} handleBack={this.props.handleBack}/>            
            }
        </div>
        );
    }
}

function ResultInfo(props) {
    const {data, handleBack} = props;

    return (
    <div>
        {/* <NetworkView/> */}

        <ResultTable
            data={data}
            columns={[
                { id: 'id', numeric: false, disablePadding: true, label: 'Name' },
                { id: 'value', numeric: true, disablePadding: false, label: 'Value' }]}
          />
        <div>
            <Button variant="contained" onClick={handleBack}>
                Back
            </Button>
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