
import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import RegisterForm from './components/loginManager/RegisterForm'
import LoginForm from './components/loginManager/LoginForm'
import HomeManager from './components/HomeManager/HomeManager'


function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Switch>
            <Route exact path="/"><p>Welcome Home</p></Route>
            <Route exact path="/register"><RegisterForm></RegisterForm></Route>
            <Route exact path="/login"><LoginForm></LoginForm></Route>
            <Route exact path="/profile"><LoginForm></LoginForm></Route>
            <Route exact path="/home"><HomeManager></HomeManager></Route>

        </Switch>
        </BrowserRouter>

    </div>
  );
}

export default App;
