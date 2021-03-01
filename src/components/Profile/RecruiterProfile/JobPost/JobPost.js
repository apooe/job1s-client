import React, {Component} from 'react';
import './JobPost.css'

class JobPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onChangeJobPost: false,
            jobPost: null,
            newJobPost : false
        };
    }

    componentDidMount() {
        const jobPost = this.props.jobPost || {companyName: ''};
        this.setState({jobPost});
        if(this.props.jobPost)//exist
            this.setState({newJobPost : true});
    }

    handleJobPostChange = (newValue) => {

        const oldJobPost = {...this.state.jobPost}; // Deep Copy of the profile field
        const newJobPost = {...oldJobPost, ...newValue};
        this.setState({jobPost: newJobPost})

    }
    onSubmit = () => {

        this.props.onFormSubmit(this.state.jobPost);
    }

    onClose = () => {
        this.props.onClose();
    }

    onDelete = () => {
        this.props.onPostDelete(this.state.jobPost);
    }

    render() {
        const {jobPost} = this.state;

        if (!jobPost) {
            return null;
        }


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <input
                            type="text"
                            onChange={e => this.handleJobPostChange({companyName: e.target.value})}
                            className="form-control companyName"
                            placeholder="Name"
                            value={jobPost.companyName}
                            required
                        />

                        <input
                            type="text"
                            onChange={e => this.handleJobPostChange({title: e.target.value})}
                            className="form-control"
                            placeholder="Title"
                            value={jobPost.title}
                        />


                        <input
                            type="text"
                            onChange={e => this.handleJobPostChange({location: e.target.value})}
                            className="form-control"
                            placeholder="Location"
                            value={jobPost.location}
                        />

                        <input
                            type="text"
                            onChange={e => this.handleJobPostChange({employment: e.target.value})}
                            className="form-control"
                            placeholder="Employment"
                            value={jobPost.employment}

                        />

                        <textarea
                            className="form-control"
                            rows="6"
                            onChange={e => this.handleExperienceChange({description: e.target.value})}
                            placeholder="Description"
                            value={jobPost.description}
                        />

                        <input
                            type="text"
                            onChange={e => this.handleJobPostChange({url: e.target.value})}
                            className="form-control"
                            placeholder="URL"
                            value={jobPost.url}

                        />



                            <button
                                className="btn btn-primary mt-3 mb-4 "
                                onClick={this.onSubmit}>
                                Save
                            </button>

                            {this.state.newJobPost && <button
                                className=" btn btn-danger mt-3 mb-4 float-right"
                                onClick={this.onDelete}>
                                Remove
                            </button>}

                            <button type="button" className="close" aria-label="Close"
                            onClick={this.onClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>


                    </div>
                </div>

            </div>

        )
    }

}

export default JobPost;
