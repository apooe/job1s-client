import React, {useState} from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import RegisterForm from './components/Register/RegisterForm'
import LoginForm from './components/Login/LoginForm'
import Home from './components/Home/Home'
import ProfileUser from './components/Profile/UserProfile/ProfileUser'
import ProfileRecruiter from './components/Profile/RecruiterProfile/ProfileRecruiter'
import Navbar from "./components/Navbar/Navbar";
import {AuthServiceFactory} from './services/authService';
import MainPage from "./components/MainPage/MainPage";
import {AppContext, AUTH_TYPE_RECRUITER, defaultContextValue} from "./AppContext";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedCondRoute from "./ProtectedCondRoute";

const authService = AuthServiceFactory.getInstance();

function App() {
    const canShowToolBar = authService.isAuth();
    const [context, setCtx] = useState(defaultContextValue);

    const setContext = (object) => setCtx({...context, ...object});
    return (
        <div className="App">
            <AppContext.Provider value={{context, setContext}}>
                <BrowserRouter>
                    {context.isAuth && <Navbar isUser={false}></Navbar>}
                    <Switch>
                        <Route exact path="/"><MainPage/></Route>
                        <Route exact path="/register"><RegisterForm isUser={false}></RegisterForm></Route>
                        <Route exact path="/login"><LoginForm></LoginForm></Route>
                        <Route exact path="/home"><Home></Home></Route>
                        <ProtectedCondRoute exact path="/my-profile" condition={context.userType === AUTH_TYPE_RECRUITER } componentTrue={ProfileRecruiter} componentFalse={ProfileUser} />
                        <ProtectedRoute exact path="/my-profile-user" component={ProfileUser} />
                        <ProtectedRoute exact path="/my-profile-recruiter" component={ProfileRecruiter} />
                    </Switch>
                </BrowserRouter>

            </AppContext.Provider>

        </div>
    );
}

export default App;
