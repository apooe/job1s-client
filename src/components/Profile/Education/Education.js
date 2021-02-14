import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Education extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.profile,
            onChangeEducation : false,
            education: null
        };
    }

    componentDidMount() {
        const education = this.props.education || {collegeName: ''};
        this.setState({education});
    }

    handleEducationChange = (newValue) =>{

        const  oldEducation = {...this.state.education}; // Deep Copy of the profile field
        const newEducation = {...oldEducation, ...newValue};
        this.setState({education : newEducation })

    }
    onSubmit = () => {

        console.log(this.state.education);
        this.props.onEducationSubmit(this.state.education);
    }

    onClose = () => {
        this.props.onClose();
    }

    render() {
        const {education} = this.state;

        if(!education) {
            return  null;
        }


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12" >
                        <input
                            type="text"
                            onChange={e => this.handleEducationChange({collegeName: e.target.value})}
                            className="form-control w-100"
                            placeholder="Company Name"
                            value={education.collegeName}
                        />
                        <br/>

                        <input
                            type="text"
                            onChange={e => this.handleEducationChange({degree: e.target.value})}
                            className="form-control"
                            placeholder="Position"
                            value={education.degree}
                        />
                        <br/>

                        <div className="input-group">
                            <input
                                type="month"
                                onChange={e => this.handleEducationChange({startDate: e.target.value})}
                                className="form-control"
                                value={education.startDate}
                            />
                            <span className="input-group-addon">-</span>
                            <input
                                type="month"
                                onChange={e => this.handleEducationChange({endDate: e.target.value})}
                                className="form-control"
                                value={education.endDate}
                            />
                        </div>
                        <br/>

                        <div className="btn btn-toolbar">

                            <button
                                className="btn btn-primary"
                                onClick={this.onSubmit}>
                                Save
                            </button>

                            <button
                                className="btn btn-default"
                                onClick={this.onClose}>
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

export default Education;

