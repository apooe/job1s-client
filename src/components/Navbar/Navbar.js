import React, {Component} from 'react';
import {withRouter} from "react-router";
import {MenuItems} from "./MenuItems";
import './Navbar.css';
import logo from './../../images/logo.png';
import {AppContext} from "../../AppContext";

class Navbar extends Component {

    state = {
        clicked: false,
        active: false,
        isUser: null

    }


    handleClick = () => {
        this.setState({clicked: !this.state.clicked});

    }


    render() {


        return (
            <AppContext.Consumer>
                {(globalContext) => (
                    <nav className="NavbarItems">
                        <h1 className="navbar-logo"><img src={logo}/></h1>

                        <div className="menu-icon" onClick={this.handleClick}>
                            <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>

                        </div>
                        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                            {MenuItems(globalContext).map((item, index) => {
                                return (
                                    <li key={index}>
                                        <a onClick={item.command ? item.command : () => {
                                        }} className={item.cName} id={this.state.clicked ? "active" : "none"}
                                           href={item.url}>
                                            {item.title}
                                        </a>
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
