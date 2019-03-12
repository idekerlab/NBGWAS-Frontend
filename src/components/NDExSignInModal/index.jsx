import React from 'react'
import { DialogContent, Dialog, DialogTitle, 
    Button, Grid, Paper, TextField, FormControl, Typography, Avatar } from '@material-ui/core'
import GoogleLogin from 'react-google-login';

import GoogleLogo from './images/google-logo.svg'
import GoogleLogoDisabled from './images/google-logo-disabled.svg'

import './style.css'
import Axios from 'axios';

const NDEX_USER_VALIDATION = "http://ndexbio.org/v2/user?valid=true"
// testing
const googleClientId = '802839698598-mrrd3iq3jl06n6c2fo1pmmc8uugt9ukq.apps.googleusercontent.com'

function GoogleSignOn({googleSSO, onLoginSuccess, onFailure}) {
    
    const onSuccess = (resp) => {
        const token = resp.tokenObj.token_type + ' ' + resp.tokenObj.access_token
        const profile = {
            name: resp.profileObj.name,
            image: resp.profileObj.imageUrl,
            authorization: {
                type: 'google',
                token
            }
        }

        onLoginSuccess(profile)
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
                onSuccess={onSuccess}
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
            this.props.onLoginSuccess(profile)

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
            error: null,
        }
    }

    onFailure = (err) => {
        if ('details' in err && err.details.startsWith('Not a valid origin for the client: http://localhost:')){
            this.setState({googleSSO: false})
        }else{
            const message = err.hasOwnProperty('error') ? err['error'] : JSON.stringify(err)
            this.setState({error: message})
        }
    }

    render() {
        const {
            googleSSO,
            error
        } = this.state;

        const {
            handleClose,
            onLoginSuccess,
        } = this.props

        return (
            <div>
                <DialogTitle id="form-dialog-title">Sign in to your NDEx Account</DialogTitle>
                <DialogContent>
                    <div className="NDExSignInContainer">
                        { }
                        <Grid container spacing={8}>
                            <Grid item xs={6} className="grid">
                                <Paper className='grid-paper'>
                                    <div className="grid-content">
                                        <GoogleSignOn 
                                            googleSSO={googleSSO}
                                            onLoginSuccess={onLoginSuccess}
                                            onFailure={this.onFailure}
                                        />
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} className="grid">
                                <Paper className='grid-paper'>
                                    <div className="grid-content">
                                        <CredentialsSignOn
                                            onLoginSuccess={onLoginSuccess}
                                            handleClose={handleClose}
                                        />
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    {error && 
                        <div className="sign-in-error">
                            Failed to login: {error}
                        </div>
                    }
                </DialogContent>
            </div>
        );
    }
}

export default class NDExSignInModal extends React.Component {
    
    render(){
        const {
            profile,
            handleClose,
            onLoginSuccess,
            onLogout,
            children
        } = this.props;

        return (
            <div>
                <Dialog
                    className="sign-in-container"
                    open={true}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    {profile ? 
                        <div className="sign-in-header">
                            <Avatar className="ndex-account-avatar" src={profile.image}>U</Avatar>
                            <Typography variant="h4" className="ndex-account-greeting">
                                Hi, {profile.name}
                            </Typography>
                            <Button onClick={onLogout}>Logout</Button>
                        </div>
                    :
                        <NDExSignIn
                            handleClose={handleClose}
                            onLoginSuccess={onLoginSuccess}
                            onLogout={onLogout}
                        />
                    }
                    {children}
                </Dialog>
            </div>
        );
    }
}