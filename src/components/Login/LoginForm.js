import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField, Button} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import "./LoginManager.css";
import {Redirect, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {getInstance} from "../../helpers/httpInstance";
import Alert from "@material-ui/lab/Alert";
import {AuthServiceFactory} from "../../services/authService";
import {AppContext} from "../../AppContext";


const authService = AuthServiceFactory.getInstance();

const LoginForm = (props) => {

    const {history} = props;
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});

    const onUserChange = (newValue) => {
        setUser({...user, ...newValue})
    }

    const onSubmit = (callback) => {
        const {email, password} = user;
        authService.logIn(email, password).then(() => {
            history.push('/home');
            callback();

        }).catch(error => {
            console.log(error.response.data);
            setError(error.response.data);
        });
    }

    if(authService.isAuth()) {
        return <Redirect to={'/home'} />
    }

    return (
        <AppContext.Consumer>
            {({context, setContext}) => (
                <div className="form-container">
                    <Grid>
                        <Paper elevation={10} id="paper">
                            <Grid align="center">
                                <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                                <h2>Sign in</h2>
                            </Grid>


                            {error && <Alert
                                severity="error"
                                style={{margin: '15px'}}
                                onClose={() => setError(null)}>
                                <strong>{error}</strong>
                            </Alert>}

                            <TextField
                                label="Email"
                                onChange={e => onUserChange({email: e.target.value})}
                                className="input-control label-field"
                                placeholder="enter your email"
                                fullWidth
                                required
                            />

                            <TextField
                                label="Password"
                                onChange={e => onUserChange({password: e.target.value})}
                                className="input-control label-field"
                                placeholder="enter your password"
                                type="password"
                                fullWidth
                                required
                            />


                            <Button
                                type="submit"
                                color="primary"
                                fullWidth
                                variant="contained"
                                id="btn"
                                onClick={() => onSubmit(() => setContext({
                                    currentUser: authService.getCurrentUser(),
                                    isAuth: authService.isAuth(),
                                    userType: authService.getCurrentUser()?.userType
                                }))}>
                                Sign in
                            </Button>


                            <Grid container justify="flex-end">
                                <Grid item>Already have an account? {" "}
                                    <Link to={"/register"} variant="body2">
                                        Sign Up
                                    </Link>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </div>
            )}

        </AppContext.Consumer>

    )
}


export default withRouter(LoginForm);
