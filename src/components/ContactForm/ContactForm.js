import React, { Component } from "react";
import "./ContactForm.css";
import { getInstance } from "../../helpers/httpInstance";

const http = getInstance();

class ContactForm extends Component {
  constructor(props) {
    super(props);
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
    const oldForm = { ...this.state }; // Deep Copy of the profile field
    const newForm = { ...oldForm, ...value }; // Merge two profile
    this.setState(newForm);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ status: "Sending" });
    const data = { ...this.state, emailDest: this.props.emailDest };

    const url = "/users/sendFormToUser";
    console.log(this.props.emailDest);

    await http.post(url, data).then((response) => {
      if (response.data.status === "sent") {
        alert("Message Sent");
        this.setState({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          message: "",
          status: "Submit",
        });
      } else if (response.data.status === "failed") {
        alert("Message Failed");
      }
    });
  };

  render() {
    let buttonText = this.state.status;
    const { profileFirstName, profileLastName } = this.props;

    return (
      <div className="row">
        <div className="col-12">
          <h2 className="contact-title">
            Contact {profileFirstName} {profileLastName}
          </h2>
          <div className="divider"></div>
        </div>

        <div className="col-12">
          <div className="col-12 col-md-10 offset-md-1">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="firstname">
                    First Name <span className="red">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    id="firstname"
                    value={this.state.firstname}
                    onChange={(e) =>
                      this.handleChange({ firstname: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastname">
                    Last Name <span className="red">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    className="form-control"
                    placeholder="Last name"
                    value={this.state.lastname}
                    onChange={(e) =>
                      this.handleChange({ lastname: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="email">
                    Email <span className="red">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(e) =>
                      this.handleChange({ email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="phone"
                    id="phone"
                    className="form-control"
                    placeholder="Phone number"
                    value={this.state.phone}
                    onChange={(e) =>
                      this.handleChange({ phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="message">
                    Message <span className="red">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    value={this.state.message}
                    className="form-control"
                    placeholder="Your message"
                    onChange={(e) =>
                      this.handleChange({ message: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-12">
                  <p className="red">* This information is required</p>
                </div>
                <div className="col-md-12">
                  <input type="submit" className="button1" value={buttonText} />
                </div>
                {buttonText === "Sending" ? (
                  <p className="sent-success">
                    Your message was sent successfully !
                  </p>
                ) : (
                  <p></p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactForm;
