import React from 'react'
import {FormHelperText, Button, Checkbox, FormControlLabel} from '@material-ui/core'
import Row from './Row'
import data from '../data'

const styles = {
    snp_input: {
        display: 'none'
    },
    file_info: {
        paddingLeft: '15px',
        fontSize: '14px',
        margin: '0px',
        alignSelf: 'center'
    },
}

function formatBytes(a, b) { if (0 === a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

class FileUpload extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            sample: false,
        }
        this.sampleFile = null;
    }

    handleRef = comp => {
        this.file_input = comp
        this.props.handleRef(comp)
    }

    blobToFile = (blob) => {
        const main = this;
        var myReader = new FileReader();
        myReader.readAsArrayBuffer(blob);
        myReader.addEventListener("loadend", function (e) {
            var buffer = e.srcElement.result;//arraybuffer object
            const f = new File([buffer], "schizophrenia.txt");
            if (main.state.sample){
                main.props.onChange(f);
                this.sampleFile = f;
            }
        });
    }

    loadSample = (url) => {
        if (this.sampleFile !== null){
            this.props.onChange(this.sampleFile)
            return
        }
        
        // // var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
        
        const main = this;
        xhr.onload = () => {
            main.blobToFile(xhr.response);
            // blob = xhr.response;//xhr.response is now a blob object
        }
        xhr.send();

    }

    sampleToggled = ev => {
        if (ev.target.checked){
            this.setState({ sample: true});
            const url = data.url.sample_file; //"/samples/schizophrenia.txt"
            this.loadSample(url);
        } else{
            this.props.onChange(null);
            this.setState({sample: false})
        }
    }

    render(){
        const {sample} = this.state;
        const {value} = this.props;

        return (<Row>
            <div style={{ display: 'flex' }}>
                <div>
                    <input
                        accept="text/*"
                        id="fileUpload"
                        style={styles.snp_input}
                        onChange={(e) => this.props.onChange(e.target.files[0])}
                        type="file"
                    />
                
                    <label htmlFor="fileUpload">
                        <Button variant="contained" component="span" disabled={sample}>
                            {data.text.snp_level_summary}
                        </Button>
                    </label>
                    
                </div>
                <p style={styles.file_info}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={sample}
                                onChange={this.sampleToggled}
                                value="sample"/>
                        }
                        label="Use Schizophrenia Example"
                        />

                </p>
            </div>
            {(value !== null) &&
                <FormHelperText>
                    File Uploaded ({formatBytes(value.size)})
                </FormHelperText>
            }
            <FormHelperText>{data.help.snp_level_summary}</FormHelperText>
        </Row>)
    }
}

export default FileUpload;