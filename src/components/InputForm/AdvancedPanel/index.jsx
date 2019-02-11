import React from 'react'
import {TextField, ExpansionPanel, ExpansionPanelSummary, Typography} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Row from '../Row'
import data from '../../../assets/data'

const styles = {
    advanced_content: {
        padding: '20px'
    },
}

const AdvancedPanel = (props) => {
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Settings (optional)</Typography>
            </ExpansionPanelSummary>
            <div style={styles.advanced_content}>
                <Row>
                    <TextField
                        name="window"
                        type="number"
                        label={data.text.window}
                        helperText={data.help.window}
                        value={props.window}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>
                <Row>
                    <TextField
                        name="alpha"
                        label={data.text.alpha}
                        helperText={<span>
                            {data.help.alpha}
                            <br />
                            If unset, then optimal parameter is selected by linear model derived from <a href="https://www.cell.com/cell-systems/fulltext/S2405-4712(18)30095-4">(Huang, Cell Systems 2018)</a>
                        </span>}
                        value={props.alpha}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>
            </div>
      </ExpansionPanel >
    )
}

export default AdvancedPanel;