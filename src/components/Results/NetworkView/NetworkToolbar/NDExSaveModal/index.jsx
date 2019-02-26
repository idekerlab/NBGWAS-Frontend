import React from 'react'
import axios from 'axios'
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, DialogTitle, Avatar, Typography } from '@material-ui/core';

import DATA from '../../../../../assets/data'
import './style.css'

export default class SaveToNDExModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            networkUrl: "",
        };
    }

    handleClose = () => {
        this.props.handleClose()//setState({ open: false });
    };

    saveToNDEx = () => {
        const { profile, cx } = this.props;
        console.log(cx)
        const authorization = profile.authorization.token;

        axios.post(DATA.url.open_in_ndex, cx, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            }
        })
            .then(resp => {
                const networkUrl = resp.data.replace("/v2/", "/#/")
                this.setState({ networkUrl })
            })
    }

    render() {
        const {
            networkUrl
        } = this.state;
        const {
            profile
        } = this.props;

        const name = profile.name;

        return (
            <div>
                <Dialog
                    open={true}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle >
                        <div className="ndex-save-header">
                            <Avatar className="ndex-account-avatar" src={profile.image}>U</Avatar>
                            <Typography variant="h4">
                                Hi, {name}
                            </Typography>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Now that you're logged in, you can save the network to your NDEx account
                        </DialogContentText>
                        <DialogActions>
                            {networkUrl ?
                                <Button
                                    href={networkUrl}
                                    target="_blank"
                                >
                                    Open in NDEx
                                </Button>
                                :
                                <Button
                                    onClick={this.saveToNDEx}
                                >
                                    Save to my account
                                </Button>
                            }
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
