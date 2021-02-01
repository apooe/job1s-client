
import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import RegisterManager from './components/loginManager/RegisterManager'



function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Switch>
            <Route exact path="/"><p>Welcome Home</p></Route>
            <Route exact path="/users"><RegisterManager></RegisterManager></Route>

        </Switch>
        </BrowserRouter>

    </div>
  );
}

export default App;
