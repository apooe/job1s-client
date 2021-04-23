import React, {Component} from 'react';
import {withRouter} from "react-router";
import {MenuItems} from "./MenuItems";
import './Navbar.css';
import logo from './../../images/logo.png';
import {AppContext} from "../../AppContext";
import {Link} from 'react-router-dom';
import SearchBar from "../SearchBar/SearchBar";


class Navbar extends Component {

    state = {
        clicked: false,
        active: false,
        isjobSeeker: false
    }

    componentDidMount() {
        console.log("is job seeker est: ", this.props.isJobSeeker);
        this.setState({isJobSeeker: this.props.isJobSeeker});
    }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked});
    }


    handleSearchProfiles = (inputSearch) => {
        console.log("ds navbar", inputSearch);
        this.state.isjobSeeker ?
            this.props.history.push(`/home/?job=${inputSearch}`) :
            this.props.history.push(`/jobs/?job=${inputSearch}`);


    }

    render() {

        const {isJobSeeker} = this.state;

        return (
            <AppContext.Consumer>
                {(globalContext) => (
                    <nav className="NavbarItems">

                        <Link to='/home' className="navbar-logo"><img src={logo}/></Link>


                        <div className="search-navbar">
                            <SearchBar searchProfiles={this.handleSearchProfiles}/>
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
