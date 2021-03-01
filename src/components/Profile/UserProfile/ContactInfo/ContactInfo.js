import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import {v4 as uuid} from "uuid";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import './ContactInfo.css'


class ContactInfo extends Component {


    constructor(props) {
        super(props);
        this.state = {
            email: null,

        };
    }

    componentDidMount() {
        const email = this.props.email;
        this.setState({email});
    }


    render() {
        const {email} = this.state;
        console.log(email);

        if (!email) {
            return null;
        }


        return (
            <div className="container">
                <DialogTitle id="form-dialog-title">
                    <h1 className="text-center pb-3">Contact Info</h1>
                </DialogTitle>

                {<p className="info-mail">
                        <MailOutlineIcon className="mr-3 mb-1" fontSize="large"/>
                        {email}
                </p>}




            </div>

        )
    }

}

export default ContactInfo;

