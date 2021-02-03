import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField , Button} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import "./LoginManager.css";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {getInstance} from "../../helpers/httpInstance";
import Alert from "@material-ui/lab/Alert";

const LoginForm = (props) =>{

    const {history} = props;
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});

    const onUserChange = (newValue) => {
        setUser({...user, ...newValue})
    }

    const onSubmit = () => {
        const http = getInstance();
        const url = '/users/login';


        http.post(url, user).then(response => {
            history.push('/home');
        }).catch(error => {
            console.log(error.response.data);
            setError(error.response.data);
        });
    }

    return  (
        <Grid>
            <Paper elevation={10} id="paper">
                <Grid align = "center">
                    <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                    <h2>Sign in</h2>
                </Grid>


                {error && <Alert
                    severity="error"
                    style={{ margin:'15px'}}
                    onClose={() => setError(null)}>
                    <strong>{error}</strong>
                </Alert>}

                <TextField
                    label="Email"
                    onChange={e => onUserChange({email: e.target.value})}
                    className="input-control"
                    placeholder="enter your email"
                    fullWidth
                    required
                />

                <TextField
                    label="Password"
                    onChange={e => onUserChange({password: e.target.value})}
                    className="input-control"
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
                    onClick={() => onSubmit()}>
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
    )
}


export default withRouter(LoginForm);
