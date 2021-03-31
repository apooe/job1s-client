import React, {useState} from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import RegisterForm from './components/Register/RegisterForm'
import LoginForm from './components/Login/LoginForm'
import Home from './components/Home/Home'
import ProfileUser from './components/Profile/UserProfile/ProfileUser'
import ProfileRecruiter from './components/Profile/RecruiterProfile/ProfileRecruiter'
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./components/MainPage/MainPage";
import Jobs from "./components/Jobs/jobPostsList";
import {AppContext, AUTH_TYPE_JOB_SEEKER, AUTH_TYPE_RECRUITER, defaultContextValue} from "./AppContext";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedCondRoute from "./ProtectedCondRoute";


function App() {

    const [context, setCtx] = useState(defaultContextValue);
    const setContext = (object) => setCtx({...context, ...object});
    return (
        <div >
            <AppContext.Provider value={{context, setContext}}>
                <BrowserRouter>
                    {context.isAuth && <Navbar></Navbar>}
                    <Switch>
                        <Route exact path="/"><MainPage/></Route>
                        <Route exact path="/register"><RegisterForm isJobseeker={context.userType}></RegisterForm></Route>
                        <Route exact path="/login"><LoginForm></LoginForm></Route>
                        <ProtectedRoute exact path="/home" component={Home} />
                        <ProtectedCondRoute exact path="/my-profile" condition={context.userType === AUTH_TYPE_RECRUITER } componentTrue={ProfileRecruiter} componentFalse={ProfileUser} />
                        <ProtectedRoute exact path="/my-profile-user" component={ProfileUser} />
                        <ProtectedRoute exact path="/my-profile-recruiter" component={ProfileRecruiter} />
                        <ProtectedRoute exact path="/jobs" component={Jobs} />
                        <ProtectedCondRoute exact path="/profiles/:id" component={ProfileUser} />


                    </Switch>
                </BrowserRouter>

            </AppContext.Provider>

        </div>
    );
}

export default App;
