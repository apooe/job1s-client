import React, {useContext, useState} from 'react';
import "../Login/LoginManager.css";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {useHistory} from "react-router"
import Button from '@material-ui/core/Button';
import {Avatar, Grid, Paper, TextField} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {AppContext} from "../../AppContext";
import {getInstance} from "../../helpers/httpInstance";

const http = getInstance();

export default function ChangePassword() {

    const {context, setContext} = useContext(AppContext);
    const history = useHistory();

    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [userId, setUserId] = useState('');
    const [code, setCode] = useState(null);
    const [step, setStep] = useState(1);
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('');

    const onPasswordChange = (newValue) => {
        const pwd = password;
        const newPwd = {...pwd, ...newValue}
        setPassword(newPwd);

    }


    const onEmail = (newValue) => {
        setEmail(newValue);
    }
    const onCode = (newValue) => {
        setCode(newValue);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        switch (step) {
            case 1:
                getUser();
                break;
            case 2:
                checkCode();
                break;
            case 3:
                changePassword();
                break;

            default:
                console.log("ds etape 4");


        }
    }
    const getUser = async () => {

        try {
            const url = `users/resetPassword/${email}`;
            const {data} = await http.get(url);
            setUserId(data);
            await setErrorText(false, "");
            setStep(2);


        } catch (e) {
            await setErrorText(true, e?.response?.data);

        }
    }

    const checkCode = async () => {
        try {
            const url = `users/codeVerification/${code}`;
            await http.get(url);
            await setErrorText(false, "");
            setStep(3);


        } catch (e) {
            await setErrorText(true, e?.response?.data);

        }
    }

    const changePassword = async () => {
        console.log(password, userId);
        try {
            const url = `users/changePassword/${userId}`;
            await http.post(url, password);
            await setErrorText(false, "");
            setStep(4);


        } catch (e) {
            await setErrorText(true, e?.response?.data);

        }
    }

    const setErrorText = async (isError, text) => {
        setError(isError);
        setHelperText(text);
    }


    return (

        <div className="form-container">

            <Grid>
                <Paper elevation={10} id="paper-status">
                    <Grid align="center">
                        <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                        <h2 className="mb-3">Change password </h2>
                        {error && <FormHelperText className="text-center helper-text mb-2">{helperText}</FormHelperText>}

                        {step === 1 &&
                        <TextField
                            label="email"
                            onChange={e => onEmail(e.target.value)}
                            className="input-control label-field"
                            placeholder="enter your email"
                            type="email"
                            fullWidth
                            required
                        />}

                        {step === 2 &&
                           <div>
                               <div className="text-left mb-2">
                                   <small>We sent you a verification code. Please enter it to confirm your identity.
                                   </small>
                               </div>
                               <TextField
                                   label="code"
                                   onChange={e => onCode(e.target.value)}
                                   className="input-control label-field"
                                   placeholder="enter the code"
                                   type="text"
                                   fullWidth
                                   required
                               />
                           </div>

                        }

                        {step === 3 &&
                        <div>
                            <TextField
                                label="Password"
                                onChange={e => onPasswordChange({newPassword: e.target.value})}
                                className="input-control label-field"
                                placeholder="enter your password"
                                type="password"
                                fullWidth
                                required
                            />

                            <TextField
                                label="confirmPassword"
                                onChange={e => onPasswordChange({confirmPassword: e.target.value})}
                                className="input-control label-field"
                                placeholder="confirm your password"
                                type="password"
                                fullWidth
                                required
                            />
                        </div>
                        }

                        {step === 4 &&
                        <div className="mt-3"> Password changed !</div>}

                    </Grid>
                    <form onSubmit={handleSubmit} className="ml-auto mr-auto d-table">

                        <FormControl component="fieldset">
                            {step !== 4 ?
                                <Button className="mt-2 mb-1" type="submit" variant="contained"
                                        color="primary">
                                    Submit
                                </Button> :
                                <a className="mt-3 " href="/login">
                                    <Button variant="contained"
                                        color="primary">
                                    Sign in
                                </Button>
                                </a>

                            }


                        </FormControl>
                    </form>
                </Paper>
            </Grid>
        </div>
    );
}


