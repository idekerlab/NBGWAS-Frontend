import React from 'react'
import {TextField, ExpansionPanel, ExpansionPanelSummary, Typography} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Row from '../Row'
import config from '../../../assets/config'
import './style.css'

const AdvancedPanel = (props) => {
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Settings (optional)</Typography>
            </ExpansionPanelSummary>
            <div className='advanced-content'>
                <Row>
                    <TextField
                        name="window"
                        type="number"
                        label={config.text.window}
                        helperText={config.help.window}
                        value={props.window}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>
                <Row>
                    <TextField
                        name="alpha"
                        label={config.text.alpha}
                        helperText={<span>
                            {config.help.alpha}
                            <br />
                            If unset, then optimal parameter is selected by linear model derived from <a href="https://www.cell.com/cell-systems/fulltext/S2405-4712(18)30095-4">(Huang, Cell Systems 2018)</a>
                        </span>}
                        value={props.alpha}
                        onChange={props.handleChange}
                        fullWidth
                    />
                </Row>

                <FormControlLabel
                  control={
                    <Switch
                      checked={props.size_adjustment}
                      onChange={props.handleSwitch}
                      color="primary"
                    />
                  }
                  label="Enable Size Adjustment"
                  labelPlacement="start"
                />


            </div>
      </ExpansionPanel >
    )
}

export default AdvancedPanel;
