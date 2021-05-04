import React, {Component} from 'react';
import {withRouter} from "react-router";
import {MenuItems} from "./MenuItems";
import './Navbar.css';
import logo from './../../images/logo.png';
import {AppContext, AUTH_TYPE_JOB_SEEKER} from "../../AppContext";
import {Link} from 'react-router-dom';
import SearchBar from "../SearchBar/SearchBar";


class Navbar extends Component {
    static contextType = AppContext;

    state = {
        clicked: false,
        active: false,
        isjobSeeker: false
    }

    componentDidMount() {
        if(this.context.context.userType === AUTH_TYPE_JOB_SEEKER){
            this.setState({isjobSeeker: true});

        }
    }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked});
    }


    handleSearch = (inputSearch) => {
        console.log("ds navbar", inputSearch, this.state.isjobSeeker);

        this.state.isjobSeeker ?
            this.props.history.push(`/jobs/?job=${inputSearch}`)
            :
            this.props.history.push(`/home/?job=${inputSearch}`);


    }

    render() {

        const {isJobSeeker} = this.state;

        return (
            <AppContext.Consumer>

                {(globalContext) => (
                    <nav className="NavbarItems">

                        <Link to='/home' className="navbar-logo"><img src={logo}/></Link>


                        <div className="search-navbar">
                            <SearchBar search={this.handleSearch}/>
                        </div>

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
