import React, {Component, useState} from 'react';
import './JobPost.css'
import {getInstance} from "../../../../helpers/httpInstance";
import DialogContent from "@material-ui/core/DialogContent";
import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import {debounce} from "lodash";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const http = getInstance();

class JobPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onChangeJobPost: false,
            jobPost: null,
            newJobPost: false,
            fileToUpload: null,
            places: [],
            jobs: [],
            checked: false,
            removeJobPost: false,
            originalJobPost: null,


        };
    }

    componentDidMount() {

        if (this.props.jobPost) {// if exist
            this.setState({checked: this.props.jobPost.companyImg});

        } else {
            this.setState({newJobPost: true});
        }

        const jobPost = this.props.jobPost || {companyName: ''};
        this.setState({jobPost, originalJobPost: {...jobPost}});

    }

    handleChange = async () => {
        await this.setState({checked: !this.state.checked})
        this.handleJobPostChange({companyImg: !this.state.companyImg})
    };


    loadPlaceOptions = async (newValue) => {
        const url = '/place';
        await http.get(url, {params: {city: newValue}}).then(response => {
            this.setState({places: response?.data || []})

        }).catch(error => {
            console.log(error?.response?.data);

        });
    }

    handleJobTitleChange = (job) => {

        const id = job.title?.uuid;

        this.handleJobPostChange({jobPostId: id}).then(res => {
            this.handleJobPostChange({title: job.title?.suggestion}).then(res => {
            }).catch(error => {
                console.log(error?.response?.data);

            }).catch(error => {
                console.log(error?.response?.data);

            })
        })

    }


    handleJobPostChange = async (newValue) => {

        const oldJobPost = {...this.state.jobPost}; // Deep Copy of the profile field
        const newJobPost = {...oldJobPost, ...newValue};
        this.setState({jobPost: newJobPost})

    }

    onSubmit = async (e) => {
        e.preventDefault();
        const {checked, removeJobPost, jobPost, originalJobPost, newJobPost} = this.state;
        if (!checked) {
            await this.handleJobPostChange({companyImg: false});
        }

        if (removeJobPost) {
            this.props.onPostDelete(jobPost);
        } else {
            const isChangedJob = originalJobPost && originalJobPost.title !== jobPost.title;
            if (newJobPost || isChangedJob) {
                jobPost.relatedJobs = await this.getRelatedJobs();
            }

            this.props.onFormSubmit(jobPost);
        }
    }

    getRelatedJobs = async () => {

        const id = this.state.jobPost.jobPostId;
        try {
            const url = `http://api.dataatwork.org/v1/jobs/${id}/related_jobs`;

            const response = await axios.get(url);
            return response?.data?.related_job_titles.map(j => j.title);
        } catch (e) {
            console.error(e)
        }

    }

    onClose = () => {
        this.props.onClose();
    }

    onDelete = async () => {
        await this.setState({removeJobPost: !this.state.removeJobPost});

    }

    searchJob = async (newValue) => {
        const url = `http://api.dataatwork.org/v1/jobs/autocomplete`;
        await axios.get(url, {params: {contains: newValue}}).then(response => {
            this.setState({jobs: response?.data || []})

        }).catch(error => {
            console.log(error?.response?.data);

        });

    }


    render() {
        const {jobPost} = this.state;

        if (!jobPost) {
            return null;
        }


        return (
            <div className="container ">

                <form action="" onSubmit={this.onSubmit}>
                    <label className="label-jp">Company name <span className="mandatory">*</span></label>
                    <input
                        type="text"
                        onChange={e => this.handleJobPostChange({companyName: e.target.value})}
                        className="form-control"
                        fullWidth
                        placeholder="Company name"
                        value={jobPost.companyName}
                        required
                    />


                    <label className="label-jp">Job <span className="mandatory">*</span></label>
                    <Autocomplete
                        id="combo-box-demo"
                        className="location-autocomplete"
                        options={this.state.jobs}
                        getOptionLabel={option => option.suggestion || option}
                        fullWidth
                        freeSolo
                        value={jobPost.title}
                        onInputChange={debounce((event, value) => this.searchJob(value), 100)}
                        onChange={(e, value) => this.handleJobTitleChange({title: value})}
                        renderInput={(params) => (
                            <TextField  {...params} className="location-title"
                                        variant="outlined" required/>
                        )}

                    />

                    <label className="label-jp">Employment type <span className="mandatory">*</span></label>
                    <input
                        type="text"
                        onChange={e => this.handleJobPostChange({employment: e.target.value})}
                        className="form-control"
                        placeholder="Employment"
                        value={jobPost.employment}
                        required
                    />


                    <label className="label-jp">Location <span className="mandatory">*</span></label>
                    <Autocomplete
                        id="combo-box-demo"
                        className="location-autocomplete"
                        options={this.state.places}
                        fullWidth
                        freeSolo
                        value={jobPost.location}
                        onInputChange={(event, value) => this.loadPlaceOptions(value)}
                        onChange={(event, value) => this.handleJobPostChange({location: value})}
                        renderInput={(params) => (
                            <TextField  {...params} className="location-title"
                                        variant="outlined" required/>
                        )}

                    />


                    <label className="label-jp">Description <span className="mandatory">*</span></label>
                    <textarea
                        className="form-control "
                        rows="6"
                        onChange={e => this.handleJobPostChange({description: e.target.value})}
                        placeholder="Description"
                        value={jobPost.description}
                        required

                    />
                    <label className="label-jp">URL</label>
                    <input
                        type="text"
                        onChange={e => this.handleJobPostChange({url: e.target.value})}
                        className="form-control"
                        placeholder="URL"
                        value={jobPost.url}

                    />

                    <div>
                        <FormControlLabel control={
                            <Checkbox
                                checked={this.state.checked}
                                onChange={this.handleChange}
                                inputProps={{'aria-label': 'primary checkbox'}}
                            />
                        } label="Add your company logo for this job post."/>

                    </div>


                    <p><span className="mandatory">*Required fields</span></p>

                    <button
                        type="submit"
                        className="btn btn-primary mt-3 mb-4 ">
                        Save
                    </button>

                    {!this.state.newJobPost && <button
                        type="submit"
                        className=" btn btn-outline-dark mt-3 mb-4 float-right"
                        onClick={() => this.onDelete()}>
                        Remove
                    </button>}

                </form>
            </div>


        )
    }

}

export default JobPost;
