import React, {Component, useState} from "react";
import {AuthServiceFactory} from "../../../services/authService";
import {withRouter} from "react-router";
import './ProfileRecruiter.css';
import IconButton from "@material-ui/core/IconButton";
import ContactForm from "../../ContactForm/ContactForm";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import JobPost from "./JobPost/JobPost";
import Dialog from "@material-ui/core/Dialog";
import {getInstance} from "../../../helpers/httpInstance";
import {v4 as uuid} from "uuid";
import EditIcon from "@material-ui/icons/Edit";
import picImage from "../../../images/Unknown_person.jpg";
import defaultPic from "../../../images/unknown-company.PNG";
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
import {AppContext, defaultContextValue} from "../../../AppContext";


const http = getInstance();

class ProfileRecruiter extends Component {
    static contextType = AppContext;


    constructor(props, context) {
        super(props, context);
        this.state = {
            recruiter: null,
            onChangeJobPost: false,
            selectedJobPost: null,
            fileToUpload: null,
            onEditImg: false,
            newImgSource: null,
            uploadedFile: null,
            onViewJob: false,
            onEditInfos: false,
            originalSelectedJp:null,
            isMyProfile: true,

        };
        this.uploadImg = React.createRef();
    }

    componentDidMount() {
        const recruiter = AuthServiceFactory.getInstance().getCurrentUser();
        this.setState({recruiter});
        this.getProfile(recruiter._id);

        this.props.match.params.id ? // if user visit other profiles or his profile
            this.isVisitedProfile(false, `/recruiters/${this.props.match.params.id}`) :
            this.isVisitedProfile(true, `/recruiters/${recruiter._id}`)

    }

    isVisitedProfile = async (isMyProfile, url) => {

        await http.get(url).then(response => {
            this.setState({recruiter: response.data, isMyProfile: isMyProfile});
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    handleProfilePictureChange = async (event) => {
        // Get File Infos

        const fileToUpload = event.target.files[0];
        await this.setState({fileToUpload, onEditImg: true});
        await this.uploadFile(this.state.fileToUpload);

    }

    editInfos = async () => {

        const {recruiter} = this.state;

        if (this.state.onEditImg) {
            recruiter.profileImg = this.state.newImgSource;
        }

        const url = '/recruiters';

        console.log("ds le put recruiter", recruiter);
        http.put(url, recruiter).then(response => {
            console.log("data: ", response.data);
        }).catch(error => {
            console.log(error?.response?.data);
        });

        this.setState({onEditInfos: false});
    }

    uploadFile = async (fileToUpload) => {
        if (!fileToUpload) {
            return null; // Not file to upload
        }

        //Format file before uploading (BECAUSE IS NOT JSON)
        const formData = new FormData();
        formData.append(
            "img",
            fileToUpload,
            fileToUpload.name
        );

        const url = '/uploadImg';

        await http.post(url, formData).then(({data}) => {
            // Change profile info
            if (this.state.onEditImg) {
                this.setState({newImgSource: data.link, fileToUpload: null});
            }
        }).catch(error => {
            console.log(error?.response?.data);
        });

    }


    getProfile = (id) => {
        const url = `/recruiters/${id}`;
        http.get(url).then(response => {
            console.log("data from getprofile: ", response.data);
            this.setState({recruiter: response.data});


        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    addJobPost = () => {
        this.setState({onChangeJobPost: !this.state.onChangeJobPost, selectedJobPost: null, originalSelectedJp: null});
    }

    updateJobPostsList = (data) => {

        this.setState({onChangeJobPost: !this.state.onChangeJobPost, selectedJobPost: data, originalSelectedJp: data});
    }

    onCloseWindow = () => {

        this.setState({onChangeJobPost: false, selectedJobPost: null, onViewJob: false, onEditInfos: false, originalSelectedJp: null});
    };



    handleJobSubmit = async (newPostJob) => {

        const {recruiter, selectedJobPost, isMyProfile} = this.state;
        const newRecruiter = {...recruiter};
        const isNewPostJob = !selectedJobPost;

        if (isNewPostJob) {
            newRecruiter.jobPosts = newRecruiter?.jobPosts ? [...newRecruiter.jobPosts, newPostJob] : [newPostJob];

        } else {
            newRecruiter.jobPosts = newRecruiter?.jobPosts.map(jp => (
                jp.companyName === this.state.originalSelectedJp.companyName &&
                jp.title === this.state.originalSelectedJp.title ) ? newPostJob : jp);
        }
        await this.setState({recruiter: newRecruiter, selectedJobPost: null, onChangeJobPost: false});
        await this.updateJobPost();



    }

    handleDelete = async (jobpost) => {
        console.log(jobpost)
        const {recruiter} = this.state;
        const newRecruiter = {...recruiter};
        newRecruiter.jobPosts = newRecruiter.jobPosts.filter(
            jp => (jp.companyName !== this.state.originalSelectedJp.companyName ||
                jp.title !== this.state.originalSelectedJp.title ||
                jp.description !== this.state.originalSelectedJp.description));
        console.log("delete", newRecruiter)
        await this.setState({recruiter: newRecruiter, selectedJobPost: null, onChangeJobPost: false});
        await this.updateJobPost();

    }

    updateJobPost = async () => {
        const url = '/recruiters';
        const {recruiter} = this.state;
        await http.put(url, recruiter).then(response => {
            console.log("data dans update arr: ", response.data);
        }).catch(error => {
            console.log(error?.response?.data);
        });
        this.setState({onChangeJobPost: false});
        await this.context.setContext({currentUser: this.state.recruiter});

    }

    showJobPost = (jobPost) => {
        this.setState({onViewJob: !this.state.onViewJob, selectedJobPost: jobPost});

    }

    handleChangeInfos = () => {
        this.setState({onEditInfos: !this.state.onEditInfos});

    }

    handleCompanyLinkChange = (link) => {
        const oldRecruiter = {...this.state.recruiter}; // Deep Copy of the profile field
        const newRecruiter = {...oldRecruiter, companyLink: link};
        this.setState({recruiter: newRecruiter})
    }

    render() {

        const {recruiter, selectedJobPost, onEditInfos, onViewJob, onChangeJobPost, onEditImg, isMyProfile} = this.state;
        const profilePictureImg = recruiter?.profileImg ? `${process.env.REACT_APP_API_BASE_URL}${recruiter?.profileImg}` : defaultPic;
        const newImg = onEditImg ? `${process.env.REACT_APP_API_BASE_URL}${this.state.newImgSource}` : "";

            return (
            <div>
                <div className="container mt-5">
                    <div className="row">
                        {/*profile picture + name + infos + visit website*/}
                        <div className="col-4 presentation-profile">

                            {isMyProfile && <div>
                                <IconButton aria-label="edit" className="text-info edit-icon"
                                            onClick={() => this.handleChangeInfos()}>
                                    <EditIcon
                                        fontSize="small">
                                    </EditIcon>
                                </IconButton>
                            </div>}

                            <section className="border rounded p-5">
                                <div className="picture pb-4">
                                    {<a href={recruiter?.companyLink} target="_blank">
                                        <img className="pic-recruiter" src={profilePictureImg} alt="profile picture"/>
                                    </a>}
                                </div>

                                <div className="infos m-1">
                                    <p className="name text-center font-weight-bold">{recruiter?.firstname} {recruiter?.lastname}</p>
                                </div>

                                <button className="visit-website btn border bg-light">
                                    <a href={recruiter?.companyLink} target="_blank">Visit website
                                        <LaunchIcon
                                            fontSize="small">
                                        </LaunchIcon></a>
                                </button>


                            </section>
                        </div>

                        {/*jobposts of recruiter*/}
                        <div className="col-8">
                            <section className="bg-light rounded  border">
                                <h1 className="category-profile ml-3 "> JobPosts
                                    {isMyProfile && <IconButton aria-label="add" className="text-info"
                                                onClick={() => this.addJobPost()}>
                                        <AddCircleOutlineIcon
                                            fontSize="large">
                                        </AddCircleOutlineIcon>
                                    </IconButton>}
                                </h1>
                                {recruiter?.jobPosts && recruiter?.jobPosts.length ?
                                    <div>
                                        {
                                            recruiter?.jobPosts && recruiter.jobPosts.map((jp, index) =>

                                                <div key={uuid()} className="each-one-jobpost border">

                                                    <div className="row" onClick={() => this.showJobPost(jp)}>
                                                        <div className="col ml-3">

                                                            {jp.companyImg ?
                                                            <img className="company-pic" src={profilePictureImg}
                                                                 alt="company picture"/> :
                                                                <img className="company-pic" src={defaultPic}
                                                                     alt="company picture"/>}

                                                            <h5 className="r-company-name pt-2">{jp.companyName}</h5>
                                                            <p className="r-title p-0 m-0">{jp.title}</p>
                                                            <p className="r-location p-0 m-0">{jp.location}</p>


                                                            {isMyProfile && <IconButton aria-label="show"
                                                                        className="text-info show-icon"
                                                                        onClick={() => this.updateJobPostsList(jp)}>
                                                                <EditIcon
                                                                    fontSize="small">
                                                                </EditIcon>
                                                            </IconButton>}


                                                        </div>
                                                    </div>

                                                </div>)
                                        }
                                    </div> :

                                    <p className="p-3">there is no job post !</p>
                                }

                            </section>
                        </div>
                    </div>

                    {/*contact formulaire*/}
                    <div className="row mt-5 mb-2">
                        <div className="col-12">
                            <section className="bg-light rounded p-5 border contact-form">
                                <ContactForm
                                    profileFirstName={recruiter?.firstname}
                                    profileLastName={recruiter?.lastname}
                                    emailDt={recruiter?.email}></ContactForm>
                            </section>
                        </div>
                    </div>

                    {/*change jobpost*/}
                    {(onViewJob || onChangeJobPost) &&
                    <Dialog open={onChangeJobPost}
                            onClose={this.onCloseWindow}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            <p className="text-center font-weight-bold">
                                Post a Job
                                <button type="button" className="close" aria-label="Close"
                                        onClick={this.onCloseWindow}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </p>
                        </DialogTitle>
                        <DialogContent>
                            <JobPost jobPost={selectedJobPost}
                                     onFormSubmit={this.handleJobSubmit}
                                     onPostDelete={this.handleDelete}
                                     onClose={() => this.onCloseWindow()}/>
                        </DialogContent>
                    </Dialog>}

                    {/*view jobpost*/}
                    {selectedJobPost && !onChangeJobPost &&
                    <Dialog open={onViewJob}
                            onClose={this.onCloseWindow}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">

                            {selectedJobPost.companyImg ? <img className="company-pic-view"
                                 src={profilePictureImg} alt="company picture"/> :
                                <img className="company-pic-view"
                                     src={defaultPic} alt="company picture"/>
                            }

                            <p className="text-center jp-title-view">
                                {selectedJobPost.title}
                            </p>
                            <small>
                                <h5 className="text-center m-0"><a href={selectedJobPost.url}
                                                                   target="_blank">{selectedJobPost.companyName}</a>
                                </h5>
                                <p className="font-italic text-center"> {selectedJobPost.location}</p>

                            </small>

                        </DialogTitle>

                        <DialogContent>
                            <div className="row ">
                                <p className="col pl-4 jp-descr-current">
                                    {selectedJobPost.description}
                                </p>
                            </div>

                            <div className="row">
                                <p className="col pl-4 ">Employment type: <br/>
                                    <strong>{selectedJobPost.employment}</strong>

                                </p>
                            </div>

                            <div className="row">
                                <div className="col btn">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => this.showJobPost(null)}>
                                        Close
                                    </button>


                                </div>
                            </div>


                        </DialogContent>
                    </Dialog>}

                    {/*edit infos*/}
                    {onEditInfos &&
                    <Dialog open={onEditInfos}
                            onClose={this.onCloseWindow}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center font-weight-bold edit-info">Edit
                            your profile</p>
                        </DialogTitle>
                        <DialogContent>

                            <div className="picture pt-3 pb-3">
                                {onEditImg ?
                                    <img className="profile-pic" src={newImg} alt="profile picture"/> :
                                    <img className="profile-pic" src={profilePictureImg} alt="profile picture"/>}
                            </div>


                            <p className="update-pic">Update you profile picture</p>
                            <div>
                                <input type="file"
                                       ref={this.uploadImg}
                                       className="form-control input-file"
                                       id="actual-btn"
                                       name="profile-picture"
                                       hidden
                                       onChange={this.handleProfilePictureChange} name="profile-picture"/>
                                <label className="label-upload" htmlFor="actual-btn">Choose File
                                    <i className="pl-2 fa fa-upload" aria-hidden="true"></i>
                                </label>
                                <span id="file-chosen">No file chosen</span>

                                {/*<IconButton aria-label="delete" className=""*/}
                                {/*            onClick={() => {}}>*/}
                                {/*    <DeleteIcon*/}
                                {/*        fontSize="small">*/}
                                {/*    </DeleteIcon>*/}
                                {/*</IconButton>*/}
                            </div>


                            <label className="add-website "> Website URL
                                <input
                                    type="TEXT"
                                    onChange={e => this.handleCompanyLinkChange(e.target.value)}
                                    className="form-control mt-2"
                                    placeholder="URL"
                                    value={recruiter.companyLink}

                                />
                                <button
                                    className="btn btn-link remove-link"
                                    onClick={() => this.handleCompanyLinkChange("")}>
                                    Remove URL
                                </button>
                            </label>


                            <button
                                className="btn btn-primary btn-save"
                                onClick={() => this.editInfos()}>
                                Save
                            </button>


                        </DialogContent>
                    </Dialog>
                    }

                </div>
            </div>
        )
    }
}

export default withRouter(ProfileRecruiter);
