import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField, FormControlLabel, Checkbox , Button, Typography, Link} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import "./Login-register.css";

const LoginForm = (props) =>{



    return  (
        <Grid>
            <Paper elevation={10} id="paper">
                <Grid align = "center">
                    <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                    <h2>Sign in</h2>
                </Grid>
                <TextField label="Email" placeholder="enter your email" fullWidth required/>
                <TextField label="Password" placeholder="enter your password" type="password" fullWidth required/>
                <FormControlLabel
                    control={
                        <Checkbox name="checkedB" color="primary" />
                    }
                    label="Remember me"
                />

                <Button
                    type="submit"
                    color="primary"
                    fullWidth
                    variant="contained"
                    id="btn">
                    Sign in
                </Button>

                <Typography >Still Don't have an account ?
                <Link href="#">
                    Sign Up
                </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default LoginForm;
