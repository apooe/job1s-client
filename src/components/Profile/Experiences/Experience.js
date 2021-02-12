import React, {Component} from 'react';
import {getInstance} from "../../../helpers/httpInstance";
import {withRouter} from "react-router";
import 'bootstrap/dist/css/bootstrap.css';
import TextField from "@material-ui/core/TextField";


const http = getInstance();


class Experience extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.profile,
            onChangeExperience : false,
            experience: null
        };
    }

    componentDidMount() {
        const experience = this.props.experience || {companyName: ''};
        this.setState({experience});
    }

    handleExperienceChange = (newValue) =>{

        const  oldExperience = {...this.state.experience}; // Deep Copy of the profile field
        const newExperience = {...oldExperience, ...newValue};
        this.setState({experience : newExperience })

    }
    onSubmit = () => {
        //
        // console.log(this.state.profile);
        //
        // const url = '/profiles';
        // const {profile} = this.props.profile;
        // http.put(url, profile).then(response => {
        //     console.log("data: ", response.data);
        // }).catch(error => {
        //     console.log(error?.response?.data);
        // });
        // this.setState({onChangeExperience: false})


        console.log(this.state.experience);
        this.props.onExperienceSubmit(this.state.experience);

    }




    render() {
      const {experience} = this.state;

      if(!experience) {
          return  null;
      }


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12" >
                        <input
                            type="text"
                            onChange={e => this.handleExperienceChange({companyName: e.target.value})}
                            className="form-control w-100"
                            placeholder="Company Name"
                            value={experience.companyName}
                        />
                        <br/>

                        <input
                            type="text"
                            onChange={e => this.handleExperienceChange({position: e.target.value})}
                            className="form-control"
                            placeholder="Position"
                        />
                        <br/>

                        <div className="input-group">
                            <input
                                type="month"
                                onChange={e => this.handleExperienceChange({startDate: e.target.value})}
                                className="form-control"
                            />
                            <span className="input-group-addon">-</span>
                            <input
                                type="month"
                                onChange={e => this.handleExperienceChange({endDate: e.target.value})}
                                className="form-control"
                            />
                        </div>
                        <br/>

                        <textarea
                            className="form-control"
                            rows="6"
                            style={{width: '100%'}}
                            onChange={e => this.handleExperienceChange({description: e.target.value})}
                            placeholder="Description"
                        />
                        <br/>

                        <div className="btn btn-toolbar">

                            <button
                                className="btn btn-primary"
                                onClick={this.onSubmit}>
                                Save
                            </button>

                            <button
                                className="btn btn-default">
                                Cancel
                            </button>

                        </div>
                        <br/>
                    </div>
                </div>

            </div>

        )
    }

}

export default Experience;

