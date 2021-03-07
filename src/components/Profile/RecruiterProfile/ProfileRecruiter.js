import React, {Component} from "react";
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
import LaunchIcon from '@material-ui/icons/Launch';


const http = getInstance();

class ProfileRecruiter extends Component {

    _currentRecruiter = null;

    constructor(props) {
        super(props);
        this.state = {
            recruiter: null,
            onChangeJobPost: false,
            selectedJobPost: null,
            fileToUpload: null,
            onEditImg: false,
            newImgSource: null,
            uploadedFile: null,
            onViewJob: false,
            onEditInfos: false
        };
        this.uploadImg = React.createRef();
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

        const url = '/upload';

        await http.post(url, formData).then(({data}) => {
            // Change profile info
            if (this.state.onEditImg) {
                this.setState({newImgSource: data.link, fileToUpload: null});
            }
        }).catch(error => {
            console.log(error?.response?.data);
        });

    }


    componentDidMount() {
        const recruiter = AuthServiceFactory.getInstance().getCurrentUser();
        this.setState({recruiter});
        this.getProfile(recruiter._id);

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
        this.setState({onChangeJobPost: !this.state.onChangeJobPost, selectedJobPost: null});
    }

    updateArray = (data) => {

        this.setState({onChangeJobPost: !this.state.onChangeJobPost, selectedJobPost: data});
    }

    onCloseWindow = () => {

        this.setState({onChangeJobPost: false, selectedJobPost: null, onViewJob: false, onEditInfos: false});

    };

    handleJobSubmit = async (newPostJob) => {

        const {recruiter, selectedJobPost} = this.state;
        const newRecruiter = {...recruiter};
        const isNewPostJob = !selectedJobPost;

        if (isNewPostJob) {
            console.log("NEW JobPost")
            newRecruiter.jobPosts = newRecruiter?.jobPosts ? [...newRecruiter.jobPosts, newPostJob] : [newPostJob];

        } else {
            console.log("UPDATE jobPost")
            newRecruiter.jobPosts = newRecruiter?.jobPosts.map(jp => jp._id === newPostJob._id ? newPostJob : jp);
            console.log("le nv recruiter est :", newRecruiter);
        }
        // On modifie le profile mais on attend quil click sur le button valide pour faire le PUT dans le serveur
        await this.setState({recruiter: newRecruiter, selectedJobPost: null, onChangeJobPost: false});
        this.updateArrayJobPost();
    }

    handleDelete = async (jobpost) => {

        const {recruiter} = this.state;
        const newRecruiter = {...recruiter};

        newRecruiter.jobPosts = newRecruiter.jobPosts.filter(jp => jp !== jobpost);
        await this.setState({recruiter: newRecruiter, selectedJobPost: null, onChangeJobPost: false});
        this.updateArrayJobPost();

    }


    updateArrayJobPost = () => {
        const url = '/recruiters';
        const {recruiter} = this.state;
        http.put(url, recruiter).then(response => {
            console.log("data dans update arr: ", response.data);
        }).catch(error => {
            console.log(error?.response?.data);
        });
        this.setState({onChangeJobPost: false})
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

        const {recruiter, selectedJobPost, onEditInfos, onViewJob, onChangeJobPost, onEditImg} = this.state;
        const profilePictureImg = recruiter?.profileImg ? `http://localhost:8080${recruiter?.profileImg}` : picImage;
        const newImg = onEditImg ? `http://localhost:8080${this.state.newImgSource}` : "";

        return (
            <div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-4">
                            <div>
                                <IconButton aria-label="edit" className="text-info edit-icon"
                                            onClick={() => this.handleChangeInfos()}>
                                    <EditIcon
                                        fontSize="small">
                                    </EditIcon>
                                </IconButton>
                            </div>
                            <section className="border rounded p-5 bg-light">


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


                        <div className="col-8">
                            <section className="bg-light rounded  border">
                                <h1 className="category-profile ml-3 "> JobPosts
                                    <IconButton aria-label="add" className="text-info"
                                                onClick={() => this.addJobPost()}>
                                        <AddCircleOutlineIcon
                                            fontSize="large">
                                        </AddCircleOutlineIcon></IconButton></h1>
                                {recruiter?.jobPosts.length ?
                                    <div>
                                        {
                                            recruiter?.jobPosts && recruiter.jobPosts.map((jp, index) =>

                                                <div key={uuid()} className="each-one-jobpost border">

                                                    <div className="row" onClick={() => this.showJobPost(jp)}>
                                                        <div className="col ml-3">
                                                            <h5 className="r-company-name pt-2">{jp.companyName}</h5>
                                                            <p className="r-title p-0 m-0">{jp.title}</p>
                                                            <p className="r-location p-0 m-0">{jp.location}</p>


                                                            <IconButton aria-label="show"
                                                                        className="text-info show-icon"
                                                                        onClick={() => this.updateArray(jp)}>
                                                                <EditIcon
                                                                    fontSize="small">
                                                                </EditIcon>
                                                            </IconButton>


                                                        </div>
                                                    </div>

                                                </div>)
                                        }
                                    </div> :

                                    <p className="p-3">you didn't post any job !</p>
                                }

                            </section>
                        </div>
                    </div>


                    <div className="row mt-5 mb-2">
                        <div className="col-12">
                            <section className="bg-light rounded p-5 border contact-form">
                                <ContactForm emailDt={recruiter?.email}></ContactForm>
                            </section>
                        </div>
                    </div>

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


                    {selectedJobPost && !onChangeJobPost &&
                    <Dialog open={onViewJob}
                            onClose={this.onCloseWindow}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            <p className="text-center pt-3 font-weight-bold ">
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
                                <p className="col pl-4">
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


                            <label><p className="update-pic">Update you profile picture</p>

                                <input type="file" ref={this.uploadImg} id="Fvis"
                                       onChange={this.handleProfilePictureChange}
                                       name="profile-picture"/>
                            </label>


                            <label className="add-website"> Website URL
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
                    </Dialog>}


                </div>
            </div>
        )
    }
}

export default withRouter(ProfileRecruiter);
