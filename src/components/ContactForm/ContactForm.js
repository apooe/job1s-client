import React, {Component} from 'react';
import './ContactForm.css';
import {getInstance} from "../../helpers/httpInstance";


const http = getInstance();

class ContactForm extends Component {

    constructor(props) {
        super();
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            message: "",
            status: "Submit",
        };
    }

    handleChange(value) {
        const emailDest = this.props.emailDest;
        console.log("lemailDest", emailDest);
        const oldForm = {...this.state}; // Deep Copy of the profile field
        const newForm = {...oldForm, ...value}; // Merge two profile
        this.setState(newForm);
        console.log(this.state, "newForm:", newForm);
    }

    handleSubmit(event) {

        event.preventDefault();
        this.setState({status: "Sending"});

        const url = "/users/sendFormToUser";
        const data = {...this.state, emailDest: this.props.emailDest};
        http.post(url, data).then((response) => {
            if (response.data.status === "sent") {
                alert("Message Sent");
                this.setState({firstname: "", lastname: "", email: "", phone: "", message: "", status: "Submit"});
            } else if (response.data.status === "failed") {
                alert("Message Failed");
            }
        });
    }

    render() {
        let buttonText = this.state.status;
        return (

            <div className="container col-lg-12">
                <h2 className="contact-title">Contact</h2>
                <div className="divider"></div>
                <div className="row">
                    <div className="col-lg-10 col-lg-offset-1">
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label for="firstname">First Name <span className="blue">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="First name"
                                        id="firstname"
                                        value={this.state.firstname}
                                        onChange={(e) => this.handleChange({firstname: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label for="lastname">Last Name <span className="blue">*</span></label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        className="form-control"
                                        placeholder="Last name"
                                        value={this.state.lastname}
                                        onChange={(e) => this.handleChange({lastname: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label for="email">Email <span className="blue">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={(e) => this.handleChange({email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label for="phone">Phone</label>
                                    <input
                                        type="phone"
                                        id="phone"
                                        className="form-control"
                                        placeholder="Phone number"
                                        value={this.state.phone}
                                        onChange={(e) => this.handleChange({phone: e.target.value})}

                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label for="message">Message <span className="blue">*</span></label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        value={this.state.message}
                                        className="form-control"
                                        placeholder="Your message"
                                        onChange={(e) => this.handleChange({message: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <p className="blue">* This information is required</p>
                                </div>
                                <div className="col-md-12">
                                    <input type="submit" className="button1" value={buttonText}/>
                                </div>
                                {buttonText === "Sending" ?
                                    <p className="sent-success">Your message was sent successfully !</p> : <p></p>}
                            </div>

                        </form>
                    </div>
                </div>
            </div>

        );
    }

}


export default ContactForm;
