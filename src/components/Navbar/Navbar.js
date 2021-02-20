import React, {Component} from 'react';
import {withRouter} from "react-router";
import {MenuItems} from "./MenuItems";
import './Navbar.css';

class Navbar extends Component {
    state  = { clicked: false,
                active: false
    }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked});

    }




    render(){
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">React<i className="fab fa-react"></i></h1>

                <div className="menu-icon"  onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>

                </div>
                    <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'} >
                        {MenuItems.map((item, index) => {
                           return (
                                <li key={index}>
                                    <a className={item.cName} id={this.state.clicked ? "active" : "none"} href={item.url}>
                                        {item.title}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
            </nav>
        )
    }
}


export default withRouter(Navbar);
