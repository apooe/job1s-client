import React, {Component} from 'react';
import {withRouter} from "react-router";
import './Home.css';

class Home extends Component {
    render(){
        return(
            <div>
                <div className="container-background">
                    <h1 id="slogan">Find Your Ideal Job</h1>
                    <hr className="separator"/>
                </div>
            </div>


        )
    }
}


export default withRouter(Home);
