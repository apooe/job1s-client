import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import {AppContext} from "../../../AppContext";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import RoomIcon from '@material-ui/icons/Room';
import "./ContactInfo.css"
import LinkIcon from '@material-ui/icons/Link';
import {v4 as uuid} from "uuid";
import EditIcon from '@material-ui/icons/Edit';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import ChangeNameAndJob from "../UserProfile/ChangeNameAndJob/ChangeNameAndJob";
import IconButton from "@material-ui/core/IconButton";
import {getInstance} from "../../../helpers/httpInstance";
const http = getInstance();


const {Component} = require("react");


class ContactInfo extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            onChangeContactInfo: false

        };
    }

    componentDidMount() {

        const user =  this.context.context.currentUser;
        const url = `/users/${user._id}`;
        http.get(url).then(response => {
            console.log("user: ", response.data);
            this.setState({user: response.data});

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    onChangeContactInfo = async () => {
        await this.setState({onChangeContactInfo: true});
    }

    onCloseWindow = async () => {
        await this.setState({onChangeContactInfo: false});

    }

    onSubmitInfo = async (user) => {

        this.setState({user: user});
        this.props.onSubmit(user);
        await this.onCloseWindow();
    }


    render() {

        const {user, onChangeContactInfo} = this.state;
        if(!user)
            return null;

        return (
            <div className="container ">

                <DialogTitle id="form-dialog-title" className="pb-3">
                    <h4>{user.firstname} {user.lastname}</h4>
                    <hr/>
                    <IconButton className="edit-contact-info pt-0">
                        <EditIcon color="action"
                                  onClick={this.onChangeContactInfo}/>
                    </IconButton>
                    <h5>Contact Info</h5>

                </DialogTitle>


                {user.websites.length !== 0 && <section className="pl-4 pb-2">
                    <div className="row">
                        <LinkIcon/>
                        <header className="ml-2 font-weight-bold pb-1">Websites</header>
                    </div>
                    {user.websites.map((url) => {
                        return (
                            <div key={uuid()} className="row pl-4">
                                <a className="ml-1" href={`${url}`}>{url}</a>
                            </div>
                        )
                    })}

                </section>}

                <section className="pl-4 py-2">
                    <div className="row">
                        <MailOutlineIcon/>
                        <header className="ml-2 font-weight-bold pb-1">Email</header>
                    </div>
                    <div className="row pl-4 pb-2">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                    </div>
                </section>


                {user.phone && <section className="pl-4 pb-2">
                    <div className="row">
                        <PhoneIcon/>
                        <header className="ml-2 font-weight-bold pb-1">Phone</header>
                    </div>
                    <div className="row pl-4">
                        <p>{user.phone}</p>
                    </div>
                </section>}

                {user.address && <section className="pl-4 pb-2">
                    <div className="row">
                        <RoomIcon/>
                        <header className="ml-2 font-weight-bold pb-1">Address</header>
                    </div>
                    <div className="row pl-4">
                        <p>{user.address}</p>
                    </div>
                </section>}

                <Dialog open={onChangeContactInfo}
                        onClose={this.onCloseWindow}
                        aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <button type="button" className="close" aria-label="Close"
                                onClick={this.onCloseWindow}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <ChangeNameAndJob user={user}
                                          onEdit={this.onSubmitInfo}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default ContactInfo;
