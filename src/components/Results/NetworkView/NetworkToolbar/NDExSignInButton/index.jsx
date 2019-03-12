import React from 'react'
import { DialogContent, Dialog, DialogTitle, 
    Button, Grid, Paper, TextField, FormControl } from '@material-ui/core'
import OpenInNDExIcon from './images/open_in_ndex.png'
import GoogleLogin from 'react-google-login';

import GoogleLogo from './images/google-logo.svg'
import GoogleLogoDisabled from './images/google-logo-disabled.svg'

import './style.css'
import Axios from 'axios';

const NDEX_USER_VALIDATION = "http://ndexbio.org/v2/user?valid=true"
// testing
const googleClientId = '802839698598-mrrd3iq3jl06n6c2fo1pmmc8uugt9ukq.apps.googleusercontent.com'

function GoogleSignOn({googleSSO, onSuccess, onFailure}) {
    
    const onLoginSuccess = (resp) => {
        const token = resp.tokenObj.token_type + ' ' + resp.tokenObj.access_token
        const profile = {
            name: resp.profileObj.name,
            image: resp.profileObj.imageUrl,
            authorization: {
                type: 'google',
                token
            }
        }

        onSuccess(profile)
    }
    
    const clsName = googleSSO ? "google-sign-in-button" : 'google-sign-in-button googleButtonDisabled'
    const title = googleSSO ? "Sign in with your Google account" : "Google Sign In is currently unavailable because the 'BLOCK THIRD-PARTY COOKIES' option is enabled in your web browser." +
    "To use the Google Sign In feature you can do one of two things:" + 
    "1. Add 'accounts.google.com' to the list of websites allowed to write / read THIRD - PARTY COOKIES, or" + 
    "2. Disable the 'BLOCK THIRD-PARTY COOKIES' option in your browser settings.";
    const logo = googleSSO ? GoogleLogo : GoogleLogoDisabled;

    return (
        <div className="google-button">
            <GoogleLogin
                clientId={googleClientId}
                render={renderProps => (
                    <Button id="googleSignInButtonId"
                        disabled={!googleSSO}
                        className={clsName}
                        title={title}
                        onClick={renderProps.onClick}
                    >
                        <span className="google-sign-in-button-span">
                            <img src={logo}
                                alt=""
                                className='googleLogo'
                            />
                            <div className='googleSignInText'
                            >Sign In / Sign Up with Google</div>
                        </span>
                    </Button>
                )}
                buttonText="Login"
                onSuccess={onLoginSuccess}
                onFailure={onFailure}
            />
        </div>
    )
}

class CredentialsSignOn extends React.Component {
    state = {
        error: null
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
            const profile = {
                name: resp.data.firstName,
                image: resp.data.image,
                authorization: {
                    type: 'ndex',
                    token: resp.config.headers['Authorization']
                }
            }
            this.props.onSuccess(profile)

        }).catch(err => {
            console.log(err)
            if ('response' in err){
                this.setState({error: err.response.data.message})
            }else {
                this.setState({error: "Unknown error"})
            }
        })
    }

    render(){
        const {
            error,
        } = this.state;

        const button_cls = error ?
            'btn btn-primary disabled' : 'btn btn-primary';

        return (
            <form 
                name="basicAuthSignIn"
                onSubmit={this.submit}
                >
                <FormControl className="form-control">
                    <TextField 
                        name="accountName" type="text" placeholder="Account Name"
                        required title="" autoComplete="username"/>
                </FormControl>
                <FormControl className="form-control">
                    <TextField name="password" type="password" placeholder="Password"
                        required title="" autoComplete="password"/>
                </FormControl>
                
                <div className="ndex-account-links">
                    <div>
                        <a href="/"
                        >Forgot Password?</a>
                    </div>
                    <div>
                        <span>Need an account? </span>
                        <a href="/"
                        >Click here to sign up!</a>
                    </div>
                </div>

                {error && 
                    <div className='text-danger'>
                        <br />
                        <strong><span
                        // style="font-size: 1.1em"
                        >{error}</span></strong>
                    </div>
                }

                <div className="credentials-button-container">
                    {this.props.handleClose &&
                        <Button className="btn btn-default"
                            variant="contained"
                            onClick={this.props.handleClose} type="button" >
                            Cancel
                        </Button>
                    }

                    <Button 
                        className={button_cls}
                        variant="contained"
                        color="primary"
                        type="submit"
                        >
                        Sign In
                    </Button>
                </div>
            </form>
        )
    }
}


export class NDExSignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            googleSSO: true,
            erros: [],
        }
    }

    onFailure = (err) => {
        if ('details' in err && err.details.startsWith('Not a valid origin for the client: http://localhost:')){
            this.setState({googleSSO: false})
        }else{
            this.setState({errors: err})
        }
    }

    render() {
        const {
            googleSSO,
            errors
        } = this.state;

        const {
            handleClose,
            onSuccess
        } = this.props

        return (
            <div>
                <DialogTitle id="form-dialog-title">Sign in to your NDEx Account</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Log in to your NDEx account with Google or a username and password.
                    </DialogContentText> */}
                    <div className="NDExSignInContainer">
                        <Grid container spacing={8}>
                            <Grid item xs={6} className="grid">
                                <Paper className='grid-paper'>
                                    <div className="grid-content">
                                        <GoogleSignOn 
                                            googleSSO={googleSSO}
                                            onSuccess={onSuccess}
                                            onFailure={this.onFailure}
                                        />
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} className="grid">
                                <Paper className='grid-paper'>
                                    <div className="grid-content">
                                        <CredentialsSignOn
                                            onSuccess={onSuccess}
                                            handleClose={handleClose}
                                        />
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="sign-in-error">
                        {JSON.stringify(errors)}
                    </div>
                </DialogContent>
            </div>
        );
    }
}

export default class NDExSignInButton extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    onSuccess = (auth) => {
        this.handleClose()
        this.props.onSuccess(auth)
    }

    render() {
        const {
            open,
        } = this.state;

        return (
            <div>
                <button onClick={this.handleOpen}><img src={OpenInNDExIcon} alt="Open in NDEx" /></button>
                <Dialog
                    className="sign-in-container"
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <NDExSignIn
                        handleClose={this.handleClose}
                        onSuccess={this.onSuccess}
                    />
                </Dialog>
            </div>
        );
    }
}