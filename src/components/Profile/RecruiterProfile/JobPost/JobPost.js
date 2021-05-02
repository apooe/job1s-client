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

        };
    }



    handleChange = async () => {
        await this.setState({checked: !this.state.checked})
        this.handleJobPostChange({companyImg: !this.state.companyImg})
    };


    componentDidMount() {

        if (this.props.jobPost) {// if exist
            this.setState({checked: this.props.jobPost.companyImg });

        }
        else{
            this.setState({newJobPost: true});
        }

        const jobPost = this.props.jobPost || {companyName: ''};
        this.setState({jobPost});

    }

    loadPlaceOptions = async (newValue) => {
        const url = '/place';
        await http.get(url, {params: {city: newValue}}).then(response => {
            this.setState({places: response?.data || []})

        }).catch(error => {
            console.log(error?.response?.data);

        });
    }



    handleJobPostChange =  (newValue) => {

        const oldJobPost = {...this.state.jobPost}; // Deep Copy of the profile field
        const newJobPost = {...oldJobPost, ...newValue};
        this.setState({jobPost: newJobPost})

    }

    onSubmit = async (e) => {

        e.preventDefault();
        if(!this.state.checked){
            await this.handleJobPostChange({companyImg: false})
        }

        if (this.state.removeJobPost) {
            this.props.onPostDelete(this.state.jobPost);

        } else {
            this.props.onFormSubmit(this.state.jobPost);
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
                        inputValue={jobPost.title}
                        className="location-autocomplete"
                        options={this.state.jobs}
                        getOptionLabel={j => j.suggestion}
                        fullwidth
                        onInputChange={debounce((event, value) => this.searchJob(value), 100)}
                        onChange={(event, value) => this.handleJobPostChange({title: value.suggestion})}
                        renderInput={(params) => (
                            <TextField   {...params}  className="location-title"
                                        variant="outlined" required />
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
                        inputValue={jobPost.location}
                        className="location-autocomplete"
                        options={this.state.places}
                        fullWidth
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
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        } label="Add your company logo for this job post."/>

                    </div>

                    {/*<div>*/}
                    {/*    <input type="file"*/}
                    {/*           className="form-control input-file"*/}
                    {/*           id="actual-btn"*/}
                    {/*           hidden*/}
                    {/*           onChange={e => this.handleJobPostChange({companyImg: e.target.value})}*/}
                    {/*           name="profile-picture"/>*/}
                    {/*    <label className="label-upload" for="actual-btn">Choose File*/}
                    {/*        <i className="pl-2 fa fa-upload" aria-hidden="true"></i>*/}
                    {/*    </label>*/}
                    {/*    <span id="file-chosen">No file chosen</span>*/}
                    {/*</div>*/}

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
