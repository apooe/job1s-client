import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField, Button} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {getInstance} from "../../helpers/httpInstance";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";
import {withRouter} from "react-router"
import {Link} from "react-router-dom";
import "../Login/LoginManager.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {AuthServiceFactory} from "../../services/authService";
const authService = AuthServiceFactory.getInstance();

const USER = 'USER';

const userValidator = Yup.object().shape({

    _id: Yup.string().optional().nullable(),
    password: Yup.string().min(6).required(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),

    lastname: Yup.string().matches(/^[a-zA-Z\s]+$/, "Invalid Last name").min(2).required("Last name is a required field"),
    firstname: Yup.string().matches(/^[a-zA-Z\s]+$/, "Invalid First name").min(2).required(" First name is a required field"),
    email: Yup.string().email().required(),
    _v: Yup.number().optional().nullable()

});
const http = getInstance();

const RegisterForm = (props) => {

    const {history, isUser} = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [places, setPlace] = useState([]);
    const [checked, setChecked] = useState( false);

    const handleChange = () => {
        setChecked(!checked);
        setIsSubmitting(checked);
    };


    const loadPlaceOptions = (newValue) => {
        console.log("newValue", newValue);
        const url = '/place';
        http.get(url, {params: {city: newValue}}).then(response => {
            setPlace(response?.data || [])
        }).catch(error => {
            console.log(error?.response?.data);

        });

    }

    const handleUserChange = (newValue) => {
        setUser({...user, ...newValue})
    }

    const onSubmit = () => {
        isUser ? userSubmit(): recruiterSubmit();

    }

    const recruiterSubmit = () => {
        const url = '/recruiters';
        setIsSubmitting(true);

        userValidator.validate(user).then(() => {

            http.post(url, user).then(response => {
                console.log(response.data._id);
                //createProfile({userId: response.data._id});
                setIsSubmitting(false);
                const {email, password} = user;
                authService.logIn(email, password ).then(() => {
                    history.push('/home');

                }).catch(error => {
                    console.log(error.response.data);
                    setError(error.response.data);
                });

            }).catch(error => {
                console.log(error?.response?.data);
                setError(error?.response?.data);
                setIsSubmitting(false);

            });

        }).catch((e) => {
            setError(e.errors);
            setIsSubmitting(false)
        });
    }

    const userSubmit = () => {
        const url = '/users';
        setIsSubmitting(true);

        console.log(user);

        userValidator.validate(user).then(() => {

            if(!checked) {
                setError("Are you over 18 years old ?");
                return;
            }

            if (currentStep === 1) {
                setCurrentStep(currentStep + 1);
                setError(null);
                setIsSubmitting(false);
                return;
            }

            http.post(url, user).then(response => {
                console.log(response.data._id);
                createProfile({userId: response.data._id});
                setIsSubmitting(false);
                //history.push("/home");
                const {email, password} = user;
                authService.logIn(email, password, USER).then(() => {
                    history.push('/home');

                }).catch(error => {
                    console.log(error.response.data);
                    setError(error.response.data);
                });

            }).catch(error => {
                console.log(error?.response?.data);
                setError(error?.response?.data);
                setIsSubmitting(false);
                setCurrentStep(1);

            });

        }).catch((e) => {
            setError(e.errors);
            setIsSubmitting(false)
        });
    }

    const createProfile = (userId) => {
        console.log(userId)
        const url = '/profiles';
        http.post(url, userId).then(response => {
            console.log(response.data);

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    return (

        <div className="form-container">

            <Grid>
                <Paper elevation={10} id="paper">
                    <Grid align="center">
                        <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                        <h2>register </h2>

                    </Grid>

                    {error && <Alert
                        severity="error"
                        style={{margin: '15px'}}
                        onClose={() => setError(null)}>
                        <strong>{error}</strong>
                    </Alert>}

                    {currentStep === 1 && <div>
                        <TextField
                            label="Email"
                            className="input-control"
                            placeholder="enter your email"
                            onChange={e => handleUserChange({email: e.target.value})}
                            fullWidth
                            value={user.email}
                            required
                        />

                        <TextField
                            label="First name"
                            className="input-control"
                            placeholder="enter your first name"
                            onChange={e => handleUserChange({firstname: e.target.value})}
                            fullWidth
                            value={user.firstname}
                            required
                        />

                        <TextField
                            label="Last name"
                            className="input-control"
                            placeholder="enter your last name"
                            onChange={e => handleUserChange({lastname: e.target.value})}
                            fullWidth
                            value={user.lastname}
                            required
                        />

                        <TextField
                            label="Password"
                            className="input-control"
                            placeholder="enter your password"
                            type="password"
                            onChange={e => handleUserChange({password: e.target.value})}
                            value={user.password}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Confirm Password"
                            className="input-control"
                            placeholder="confirm your password"
                            type="password"
                            value={user.confirmPassword}
                            onChange={e => handleUserChange({confirmPassword: e.target.value})}
                            fullWidth
                            required
                        />

                        {isUser &&
                        <FormControlLabel
                            className="checkbox"
                            control={
                                <Checkbox
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label={<span style={{ fontSize: '13px' }}>I am over 18 years old.</span>}

                        />}

                    </div>}

                    {currentStep === 2  && isUser && <div>
                        <Autocomplete
                            id="combo-box-demo"
                            options={places}
                            fullWidth
                            onInputChange={(event, value) => loadPlaceOptions(value)}
                            onChange={(event, value) => handleUserChange({city: value})}
                            renderInput={(params) => (
                                <TextField  {...params} label="City"
                                            placeholder="City"
                                            variant="outlined"/>
                            )}
                        />
                    </div>}

                    <Button
                        type="submit"
                        color="primary"
                        fullWidth
                        variant="contained"
                        id="btn"
                        disabled={isSubmitting}
                        onClick={() => onSubmit()}>
                        Join us
                    </Button>

                    <Grid container justify="flex-end">
                        <Grid item>Already have an account? {" "}
                            <Link to={"/login"} variant="body2">
                                Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
}

export default withRouter(RegisterForm);
