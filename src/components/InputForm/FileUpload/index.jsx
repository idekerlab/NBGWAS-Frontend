import React from 'react'
import axios from 'axios'
import {FormHelperText, Button, Checkbox, FormControlLabel} from '@material-ui/core'
import Row from '../Row'
import './style.css'

function formatBytes(a, b) { if (0 === a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

/**
 * FileUpload component with optional sample File checkbox and progress bar
 * 
 * Props: 
 * - sampleURL: url of optional sample file
 * - text: Button text for file select
 * - help: Helper text displayed below component
 * - onChange: function for accessing File object when selected
 * 
 */
class FileUpload extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            sample: false,
            progress: null,
            sampleFile: null
        }
    }

    blobToFile = (blob) => {
        const main = this;
        var myReader = new FileReader();
        myReader.readAsArrayBuffer(blob);
        
        myReader.onprogress = function (data) {
            if (data.lengthComputable) {
                var progress = parseInt(((data.loaded / data.total) * 100), 10);
                main.setState({progress})
                console.log(progress)
            }
        }
        myReader.addEventListener("loadend", function (e) {
            var buffer = e.srcElement.result;//arraybuffer object
            const f = new File([buffer], "schizophrenia.txt");
            if (main.state.sample){
                main.setState({ sampleFile: f })
                main.props.onChange(f);
            }
        });
    }

    loadSample = (url) => {
        console.log("Loading sample")
        if (this.state.sampleFile !== null){
            this.props.onChange(this.state.sampleFile)
            return
        }
        const main = this;

        axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/text'
            }
        })
        .then(resp => {
            const blob = new Blob([resp.data], { type: 'application/text' })
            main.blobToFile(blob);
        }).catch(err => {
            
        })
    }

    sampleToggled = ev => {
        if (ev.target.checked){
            this.setState({ sample: true, progress: -1});
            const url = this.props.sampleURL;
            this.loadSample(url);
        } else{
            this.props.onChange(null);
            this.setState({sample: false, progress: null})
        }
    }

    render(){
        const {sample, progress} = this.state;
        const {value,
            text,
            help
        } = this.props;
        const message = "File " + 
        (value !== null ? 
            "Uploaded(" + formatBytes(value.size) + ")" :
            (progress < 0 ?
                "Downloading..." :
                "Uploading... (" + progress + "%)")
        );

        return (<Row>
            <div className='upload-container'>
                <div>
                    <input
                        accept="text/*"
                        id="fileUpload"
                        className='snp_input'
                        onChange={(e) => this.props.onChange(e.target.files[0])}
                        type="file"
                    />
                
                    <label htmlFor="fileUpload">
                        <Button variant="contained" component="span" disabled={sample}>
                            {text}
                        </Button>
                    </label>
                    
                </div>
                <p className='file_info'>
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
            {(progress !== null || value != null) &&
                <FormHelperText>
                    {message}
                </FormHelperText>
            }
            <FormHelperText>{help}</FormHelperText>
        </Row>)
    }
}

export default FileUpload;