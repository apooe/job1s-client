import React, { useState, Fragment } from "react";
import { Redirect, withRouter } from "react-router";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import "./MainPage.css";
import homePageImg from "../../images/homepage.jpg";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import {
  AppContext,
  AUTH_TYPE_JOB_SEEKER,
  AUTH_TYPE_RECRUITER,
} from "../../AppContext";

const MainPage = ({ history }) => {
  return (
    <AppContext.Consumer>
      {({ context, setContext }) => (
        <Fragment>
          <header>
            <div>
              <div className="navbar-home">
                <div>
                  <Link to="/">
                    <img src={logo} />
                  </Link>
                </div>

                <div>
                  <Link to="/login" className="btn login-btn">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="container-fluid">
            <div className="row p-5">
              <div className="col-12 col-md">
                <h1 className="header-title text-center text-md-left">
                  Welcome in our community !
                </h1>

                <div className="center-sm">
                  <button
                    onClick={() => {
                      setContext({ userType: AUTH_TYPE_RECRUITER });
                      history.push("/register");
                    }}
                    className="btn btn-mainpage border mt-5"
                    type="button"
                  >
                    Post a job
                    <ArrowForwardIosIcon
                      className="arrow-icon"
                      style={{ fontSize: 30 }}
                    >
                      Post a job
                    </ArrowForwardIosIcon>
                  </button>

                  <button
                    onClick={() => {
                      setContext({ userType: AUTH_TYPE_JOB_SEEKER });
                      history.push("/register");
                    }}
                    className="btn btn-mainpage border"
                    type="button"
                  >
                    Search for a job
                    <ArrowForwardIosIcon
                      className="arrow-icon"
                      style={{ fontSize: 30 }}
                    ></ArrowForwardIosIcon>
                  </button>

                  <button
                    onClick={() => {
                      setContext({ userType: AUTH_TYPE_RECRUITER });
                      history.push("/register");
                    }}
                    className="btn btn-mainpage border"
                    type="button"
                  >
                    Search profiles
                    <ArrowForwardIosIcon
                      className="arrow-icon"
                      style={{ fontSize: 30 }}
                    ></ArrowForwardIosIcon>
                  </button>
                </div>
              </div>

              <div className="col-12 col-md img-home d-none d-lg-block">
                <img
                  src={homePageImg}
                  className="homepage-img"
                  alt="homepage image"
                />
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </AppContext.Consumer>
  );
};

export default withRouter(MainPage);
