import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FormDialog extends React.Component {
    state = {
        open: true,
        uuid: ""
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.onClose();
    };

    onSubmit = () => {
        this.handleClose();
        this.props.handleLocation(this.state.uuid)
    }

    render() {
        const {uuid} = this.state;
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">View Previous Result</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the UUID of the NAGA request
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="uuid"
                            label="UUID"
                            fullWidth
                            value={uuid}
                            onChange={ev => { this.setState({uuid: ev.target.value})}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.onSubmit} color="primary">
                            View
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}