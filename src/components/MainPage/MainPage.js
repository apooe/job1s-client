import React, {useState} from 'react';
import {Redirect, withRouter} from "react-router";
import {Link} from "react-router-dom";
import logo from "../../images/logo.png";
import './MainPage.css'
import homePageImg from "../../images/homepage.jpg";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {AppContext, AUTH_TYPE_JOB_SEEKER, AUTH_TYPE_RECRUITER} from "../../AppContext";


const MainPage = ({history}) => {


    return (
        <AppContext.Consumer>
            {({context, setContext}) => (<div>
                <div className="wrapper">

                    <nav className="navbar-home">
                        <Link to='/' className="navbar-logo"><img src={logo}/></Link>
                        <ul className="nav-menu">
                            <li>
                                <Link to='/login' className='btn login-btn'>Sign in</Link>

                            </li>
                        </ul>
                    </nav>
                </div>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col headline'>
                            <h1>Welcome in our <br/> community !</h1>

                            <button onClick={() => {
                                setContext({userType: AUTH_TYPE_RECRUITER});
                                history.push('/register')
                            }} className="btn btn-mainpage border mt-5" type="button">
                                Post a Job
                                <ArrowForwardIosIcon className="arrow-icon"
                                                     style={{fontSize: 30}}></ArrowForwardIosIcon>
                            </button>

                            <button onClick={() => {
                                setContext({userType: AUTH_TYPE_JOB_SEEKER});
                                history.push('/register')
                            }} className="btn btn-mainpage border" type="button">
                                Search for a job
                                <ArrowForwardIosIcon className="arrow-icon"
                                                     style={{fontSize: 30}}></ArrowForwardIosIcon>
                            </button>

                        </div>

                        <div className='col img-home'>
                            <img src={homePageImg} className='homepage-img' alt='homepage image'/>
                        </div>
                    </div>
                </div>


            </div>)}
        </AppContext.Consumer>

    )
}


export default withRouter(MainPage);
