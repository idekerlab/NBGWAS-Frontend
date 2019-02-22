import React from 'react'
import { DialogContent, Dialog, DialogTitle, DialogContentText, DialogActions, Button, Grid, Paper, TextField, FormControl, FormGroup } from '@material-ui/core'
import OpenInNewIcon from "@material-ui/icons/OpenInNew"

import GoogleLogo from './images/google-logo.svg'
import GoogleLogoDisabled from './images/google-logo-disabled.svg'

import './style.css'
import Axios from 'axios';

const NDEX_USER_VALIDATION = "http://ndexbio.org/v2/user?valid=true"

const styles = {
    grid: {
        padding: '10px',
        textAlign: 'center',
    },
    googleLogo: { 
        height: '70px', 
        width: '70px',
        maxHeight: '100%',
        maxWidth: '100%'
    },
    googleButtonDisabled: {
        color: '#B6B6B6',
        backgroundColor: '#FFF',
        cursor: 'not-allowed'
    },
    googleSignInText: {
        marginTop: '1.5em',
        marginLeft: '3em',
        marginRight: '3em'
    }
}

function GoogleSignOn({googleSSO}) {
    const signIn = () => {
        alert("SIGNING IN")
    }

    return (
        <div className="google-button">
            {googleSSO ? 
                <Button
                    className="google-sign-in-button"
                    type="button"
                    onClick={signIn}
                    >
                        <span className="google-sign-in-button-span">
                            <img src={GoogleLogo}
                                    alt=""
                                    style={styles.googleLogo} 
                                    />
                            <div style={styles.googleSignInText}
                            >Sign In / Sign Up with Google</div>
                        </span>
                </Button>
            :
                <Button id="googleSignInButtonId"
                    className="google-sign-in-button"
                    style={styles.googleButtonDisabled}
                    title="Google Sign In is currently unavailable because the 'BLOCK THIRD-PARTY COOKIES' option is enabled in your web browser.
                    To use the Google Sign In feature you can do one of two things:
                    1. Add 'accounts.google.com' to the list of websites allowed to write/read THIRD-PARTY COOKIES, or
                    2. Disable the 'BLOCK THIRD-PARTY COOKIES' option in your browser settings."
                    >
                    <span className="google-sign-in-button-span">
                        <img src={GoogleLogoDisabled}
                                alt=""
                                style={styles.googleLogo} 
                            />
                        <div style={styles.googleSignInText}
                        >Sign In / Sign Up with Google</div>
                    </span>
                </Button>
            }
        </div>
    )
}

class CredentialsSignOn extends React.Component {
    state = {
        errors: []
    }

    submit = (event) => {
        event.preventDefault();
        const user = window.basicAuthSignIn.accountName.value;
        const pwd = window.basicAuthSignIn.password.value;
        
        const auth = 'Basic ' + window.btoa(user + ":" + pwd);
        const config = { "headers": {
            Authorization: auth,
        }}

        Axios.get(NDEX_USER_VALIDATION, config)
        .then(resp => {
            console.log(resp)
            this.props.onLoginSuccess(auth)
        }).catch(err => {
            alert(err)
        })
    }

    render(){
        const {
            errors,
            username,
            password
        } = this.state;

        const button_cls = errors ||
            (!username.$valid || !password.$valid) ?
            'btn btn-primary disabled' : 'btn btn-primary';

        return (
            <form 
                name="basicAuthSignIn"
                onSubmit={this.submit}
                >
                <FormControl>
                    <TextField name="accountName" type="text" className="form-control" placeholder="Account Name"
                        required title="" autoComplete="username" />
                </FormControl>
                <FormControl className="form-group">
                    <TextField name="password" type="password" className="form-control" placeholder="Password"
                        required title="" autoComplete="password"/>
                </FormControl>
                <div>
                    <a href="/"
                    // ng-show="showForgotPassword" ng-click="forgotPassword()"
                    >Forgot Password?</a>
                </div>


                <div ng-show="showSignUp">
                    <br />
                    <span ng-bind-html="needAnAccount"></span>
                    <a href="/"
                    // ng-click="openBasicAuthSignUp()"
                    >Click here to sign up!</a>
                </div>

                {errors && 
                    <div
                        className='text-danger'
                    >
                        <br />
                        <strong><span
                        // style="font-size: 1.1em"
                        >{errors}</span></strong>
                    </div>
                }

                <div
                    className="AlignRight"
                >
                    {this.props.handleClose &&
                        <Button className="btn btn-default" onClick={this.props.handleClose} type="button" >
                            Cancel
                        </Button>
                    }

                    <Button 
                        className={button_cls}
                        type="submit"
                        >
                        Confirm
                    </Button>
                </div>
            </form>
        )
    }
}

export class NDExSignInButton extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    open = () => {
        this.setState({ open: true })
    }

    render() {
        const {
            open
        } = this.state;

        const {
            onLoginSuccess
        } = this.props;

        return (
            <div>
                <button onClick={this.open}><OpenInNewIcon /></button>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <NDExSignIn 
                        handleClose={this.handleClose}
                        onLoginSuccess={onLoginSuccess}
                    />
                </Dialog>
            </div>
        );
    }
}

export class NDExSignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            googleSSO: true,
        }
    }

    render() {
        const {
            googleSSO
        } = this.state;

        const {
            handleClose,
            onLoginSuccess
        } = this.props

        return (
            <div>
                <DialogTitle id="form-dialog-title">NDEx Sign In</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Log in to your NDEx account with Google or a username and password.
                    </DialogContentText>
                    <div className="NDExSignInContainer">
                        <Grid container spacing={8}>
                            <Grid item xs={6}>
                                <Paper style={styles.grid}>
                                    <GoogleSignOn 
                                        googleSSO={googleSSO}

                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper style={styles.grid}>
                                    <CredentialsSignOn
                                        onLoginSuccess={onLoginSuccess}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                        </Button>
                    <Button onClick={handleClose} color="primary">
                        Sign in
                        </Button>
                </DialogActions>
            </div>
        );
    }
}

export default NDExSignInButton;