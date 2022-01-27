import React, { Component } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";

class DeleteExperienceControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: null,
    };
  }

  componentDidMount() {
    const experience = this.props.experience || { companyName: "" };
    this.setState({ experience });
  }

  onSubmit = () => {
    this.props.onExperienceSubmit(this.state.experience, this.props.type);
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { experience } = this.state;

    if (!experience) {
      return null;
    }

    return (
      <div className="container">
        <DialogTitle id="form-dialog-title">
          <p className="text-center">Are you sure ? </p>
        </DialogTitle>
        <button className="btn btn-primary" onClick={this.onSubmit}>
          Delete
        </button>

        <button className="btn btn-default" onClick={this.onClose}>
          Cancel
        </button>
      </div>
    );
  }
}

export default DeleteExperienceControl;
