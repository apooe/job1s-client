import React, {Component} from 'react';
import {withRouter} from "react-router";


class HomeManager extends Component {
    render(){
        return(
            <h1>Welcome !!!!</h1>
        )
    }
}


export default withRouter(HomeManager);
