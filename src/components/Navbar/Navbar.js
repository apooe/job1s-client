import React, {Component} from 'react';
import {withRouter} from "react-router";
import {MenuItems} from "./MenuItems";
import './Navbar.css';
import logo from './../../images/logo.png';
import {AppContext} from "../../AppContext";
import { Link } from 'react-router-dom';

class Navbar extends Component {

    state = {
        clicked: false,
        active: false,


    }


    handleClick = () => {
        this.setState({clicked: !this.state.clicked});

    }


    render() {


        return (
            <AppContext.Consumer>
                {(globalContext) => (
                    <nav className="NavbarItems">
                        <Link to='/home' className="navbar-logo"><img src={logo}/></Link>


                        <div className="menu-icon" onClick={this.handleClick}>
                            <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>

                        </div>
                        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                            {MenuItems(globalContext).map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={item.url} onClick={item.command ? item.command : () => {
                                        }} className={item.cName} id={this.state.clicked ? "active" : "none"}>
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>)}
            </AppContext.Consumer>
        )
    }
}


export default withRouter(Navbar);
