import React, {Component} from 'react';
import {withRouter} from "react-router";
import Navbar from '../Navbar/Navbar'
import './Home.css';

class Home extends Component {
    render(){
        return(
            <div>
                <div className="container-background">
                    <Navbar></Navbar>
                    <h1 id="slogan">Find Your Ideal Job</h1>
                    <hr></hr>


                </div>
            </div>


        )
    }
}


export default withRouter(Home);
