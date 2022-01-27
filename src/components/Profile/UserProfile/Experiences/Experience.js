import React, { Component } from "react";

class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      onChangeExperience: false,
      experience: null,
    };
  }

  componentDidMount() {
    const experience = this.props.experience || { companyName: "" };
    this.setState({ experience });
  }

  handleExperienceChange = (newValue) => {
    const oldExperience = { ...this.state.experience }; // Deep Copy of the profile field
    const newExperience = { ...oldExperience, ...newValue };
    this.setState({ experience: newExperience });
  };
  onSubmit = () => {
    this.props.onExperienceSubmit(this.state.experience);
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
        <div className="row">
          <div className="col-md-12">
            <input
              type="text"
              onChange={(e) =>
                this.handleExperienceChange({ companyName: e.target.value })
              }
              className="form-control w-100"
              placeholder="Company Name"
              value={experience.companyName}
              required
            />
            <br />

            <input
              type="text"
              onChange={(e) =>
                this.handleExperienceChange({ position: e.target.value })
              }
              className="form-control"
              placeholder="Position"
              value={experience.position}
              required
            />
            <br />

            <input
              type="text"
              onChange={(e) =>
                this.handleExperienceChange({ link: e.target.value })
              }
              className="form-control"
              placeholder="URL"
              value={experience.link}
            />
            <br />

            <div className="input-group">
              <input
                type="month"
                onChange={(e) =>
                  this.handleExperienceChange({ startDate: e.target.value })
                }
                className="form-control mr-1"
                value={experience.startDate}
              />
              <span className="input-group-addon">-</span>
              <input
                type="month"
                onChange={(e) =>
                  this.handleExperienceChange({ endDate: e.target.value })
                }
                className="form-control ml-1"
                value={experience.endDate}
              />
            </div>
            <br />

            <textarea
              className="form-control"
              rows="6"
              style={{ width: "100%" }}
              onChange={(e) =>
                this.handleExperienceChange({ description: e.target.value })
              }
              placeholder="Description"
              value={experience.description}
            />
            <br />

            <div className="btn btn-toolbar">
              <button className="btn btn-primary" onClick={this.onSubmit}>
                Save
              </button>

              <button className="btn btn-default" onClick={this.onClose}>
                Cancel
              </button>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default Experience;
