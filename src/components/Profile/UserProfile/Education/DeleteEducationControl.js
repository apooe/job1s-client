import React, { Component } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";

class DeleteEducationControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      education: null,
    };
  }

  componentDidMount() {
    const education = this.props.education || { companyName: "" };
    this.setState({ education });
  }

  onSubmit = () => {
    this.props.onEducationSubmit(this.state.education, this.props.type);
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { education } = this.state;

    if (!education) {
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

export default DeleteEducationControl;
