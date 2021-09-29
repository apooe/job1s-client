import React, { useState } from "react";
import { Grid, Paper, Avatar, TextField, Button } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./LoginManager.css";
import { Redirect, withRouter } from "react-router";
import Alert from "@material-ui/lab/Alert";
import { AuthServiceFactory } from "../../services/authService";
import {
  AppContext,
  AUTH_TYPE_JOB_SEEKER,
  AUTH_TYPE_RECRUITER,
} from "../../AppContext";

const authService = AuthServiceFactory.getInstance();

const LoginForm = (props) => {
  const { history } = props;
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});

  const onUserChange = (newValue) => {
    setUser({ ...user, ...newValue });
  };

  const onSubmit = (callback) => {
    const { email, password } = user;
    authService
      .logIn(email, password)
      .then(() => {
        history.push("/home");
        callback();
      })
      .catch((error) => {
        console.log(error.response.data);
        setError(error.response.data);
      });
  };

  if (authService.isAuth()) {
    return <Redirect to={"/home"} />;
  }

  return (
    <AppContext.Consumer>
      {({ context, setContext }) => (
        <div className="form-container">
          <div>
            <Grid>
              <Paper elevation={10} id="paper">
                <Grid align="center">
                  <Avatar id="avatar">
                    <LockOutlinedIcon />
                  </Avatar>
                  <h2>Sign in</h2>
                </Grid>

                {error && (
                  <Alert
                    severity="error"
                    style={{ margin: "15px" }}
                    onClose={() => setError(null)}
                  >
                    <strong>{error}</strong>
                  </Alert>
                )}

                <TextField
                  label="Email"
                  onChange={(e) => onUserChange({ email: e.target.value })}
                  className="input-control label-field"
                  placeholder="enter your email"
                  fullWidth
                  required
                />

                <TextField
                  label="Password"
                  onChange={(e) => onUserChange({ password: e.target.value })}
                  className="input-control label-field mt-3"
                  placeholder="enter your password"
                  type="password"
                  fullWidth
                  required
                />

                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  className="mt-3"
                  variant="contained"
                  id="btn"
                  onClick={() =>
                    onSubmit(() =>
                      setContext({
                        currentUser: authService.getCurrentUser(),
                        isAuth: authService.isAuth(),
                        userType: authService.getCurrentUser()?.userType,
                      })
                    )
                  }
                >
                  Sign in
                </Button>

                <div className="row mb-4">
                  <div className="col-12 col-md-7">
                    <small>Already have an account? </small>
                    <a
                      onClick={() => {
                        setContext({ userType: AUTH_TYPE_JOB_SEEKER });
                        history.push("/status-definition");
                      }}
                      className="forget-password"
                    >
                      <small>Sign up</small>
                    </a>
                  </div>
                  <div className="col-12 col-md-5 text-md-right">
                    <a
                      onClick={() => {
                        history.push("/change-password");
                      }}
                      className="forget-password"
                    >
                      <small>I forgot my password</small>
                    </a>
                  </div>
                </div>
              </Paper>
            </Grid>
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
};

export default withRouter(LoginForm);
