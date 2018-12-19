import React from 'react'
import {FormHelperText, Button} from '@material-ui/core'
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
    handleFileChange = (file) => {
        this.setState({ snp_level_summary: file })
    }

    handleRef = comp => {
        this.file_input = comp
        this.props.handleRef(comp)
    }

    render(){
        return (<Row>
            <div style={{ display: 'flex' }}>
                <div>
                    <input
                        ref={this.handleRef}
                        accept="text/*"
                        id="snp_level_summary"
                        style={styles.snp_input}
                        onChange={(e) => this.handleFileChange(e.target.files[0])}
                        type="file"
                    />
                
                <label htmlFor="snp_level_summary">
                    <Button variant="contained" component="span" >
                        {data.text.snp_level_summary}
                    </Button>
                </label>
                </div>
                {(this.file_input === undefined ||
                    this.file_input.files[0] === undefined) ?
                    <p style={styles.file_info}>
                        <a href={data.url.sample_file} download>Example File</a> (schizophrenia on hg18)
                            </p>
                    :
                    <p style={styles.file_info}>
                        File Uploaded ({formatBytes(this.file_input.files[0].size)})
                        </p>
                }
            </div>
            <FormHelperText>{data.help.snp_level_summary}</FormHelperText>
        </Row>)
    }
}

export default FileUpload;