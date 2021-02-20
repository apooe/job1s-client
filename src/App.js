import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import RegisterForm from './components/Register/RegisterForm'
import LoginForm from './components/Login/LoginForm'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import Navbar from "./components/Navbar/Navbar";
import {AuthServiceFactory} from './services/authService';
const authService = AuthServiceFactory.getInstance();

function App() {
    const canShowToolBar = authService.isAuth();
    return (
        <div className="App">
            <BrowserRouter>
                {canShowToolBar && <Navbar></Navbar>}
                <Switch>
                    <Route exact path="/"><p>Welcome Home</p></Route>
                    <Route exact path="/register"><RegisterForm></RegisterForm></Route>
                    <Route exact path="/login"><LoginForm></LoginForm></Route>
                    <Route exact path="/home"><Home></Home></Route>
                    <Route exact path="/my-profile"><Profile></Profile></Route>
                </Switch>
            </BrowserRouter>

        </div>
    );
}

export default App;
