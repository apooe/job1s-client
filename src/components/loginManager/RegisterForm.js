import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField, FormControlLabel, Checkbox, Button, Link} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import "./Login-register.css";
import {getInstance} from "../../helpers/httpInstance";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

const userValidator = Yup.object().shape({
    _id: Yup.string().optional().nullable(),
    email: Yup.string().email().required(),
    firstname: Yup.string().min(2).required(),
    lastname: Yup.string().min(2).required(),
    password: Yup.string().min(6).required(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    _v: Yup.number().optional().nullable()
});

const RegisterForm = (props) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const onUserChange = (newValue) => {
        setUser({...user, ...newValue})
    }

    const onSubmit = () => {
        const http = getInstance();
        const url = '/users';

        setIsSubmitting(true);
        userValidator.validate(user).then(() => {
            http.post(url, user).then(response => {
                setIsSubmitting(false);
                // Redirect me
                // Afficher un message sympa
            }).catch(error => {
                console.log(error.response.data);
                setError(error.response.data);
                setIsSubmitting(false);

            });
        }).catch((e) => {
            console.log("LOUIS", user, e)
            setError(e.errors);
            setIsSubmitting(false)
        });


    }

    return (

        <Grid>
            <Paper elevation={10} id="paper">


                <Grid align="center">
                    <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                    <h2>Register</h2>
                </Grid>

                {error && <Alert severity="error" style={{margin: '20px'}} onClose={() => setError(null)}>{error}
                </Alert>}

                <TextField
                    label="Email"
                    placeholder="enter your email"
                    onChange={e => onUserChange({ email:  e.target.value})}
                    helperText="Incorrect entry."
                    fullWidth
                    required
                />

                <TextField
                    label="Firstname"
                    placeholder="enter your firstname"
                    onChange={e => onUserChange({ firstname:  e.target.value})}
                    fullWidth
                    required
                />

                <TextField
                    label="Lastname"
                    placeholder="enter your lastname"
                    onChange={e => onUserChange({ lastname:  e.target.value})}
                    fullWidth
                    required
                />

                <TextField
                    label="Password"
                    placeholder="enter your password"
                    type="password"
                    onChange={e => onUserChange({ password:  e.target.value})}
                    fullWidth
                    required
                />

                <TextField
                    label="Confirm Password"
                    placeholder="confirm your password"
                    type="password"
                    onChange={e => onUserChange({ confirmPassword:  e.target.value})}
                    fullWidth
                    required
                />


                <Button
                    type="submit"
                    color="primary"
                    fullWidth
                    variant="contained"
                    id="btn"
                    disabled={isSubmitting}
                    onClick={() => onSubmit()}>
                    Register
                </Button>

                <Grid container justify="flex-end">
                    <Grid item>Already have an account? {" "}
                        <Link href="#" variant="body2">
                            Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}




export default RegisterForm;
