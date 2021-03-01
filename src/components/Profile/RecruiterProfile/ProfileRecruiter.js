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
import DeleteIcon from "@material-ui/icons/Delete";
import picImage from "../../../images/Unknown_person.jpg";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Experience from "../UserProfile/Experiences/Experience";


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
            uploadedFile: null,
            onViewJob: false

        };
        this.uploadImg = React.createRef();
    }

    handleProfilePictureChange = async (event) => {
        // Get File Infos
        const fileToUpload = event.target.files[0];
        this.setState({fileToUpload});
        await this.uploadFile(fileToUpload);


        const url = '/recruiters';
        const {recruiter} = this.state;
        console.log("ds le put recruiter", recruiter);
        http.put(url, recruiter).then(response => {
            console.log("data: ", response.data);
        }).catch(error => {
            console.log(error?.response?.data);
        });
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
            const newRecruiter = {...this.state.recruiter};
            // Set link of the proile
            newRecruiter.profileImg = data.link;
            console.log("new recruiter", newRecruiter)
            this.setState({recruiter: newRecruiter, fileToUpload: null});

        })
    }

    componentDidMount() {
        const recruiter = AuthServiceFactory.getInstance().getCurrentRecruiter();
        console.log("cdm", recruiter);
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

        this.setState({onChangeJobPost: false});

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

    render() {
        const {recruiter, selectedJobPost} = this.state;
        const profilePictureImg = recruiter?.profileImg ? `http://localhost:8080${recruiter?.profileImg}` : picImage;

        return (
            <div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-4">
                            <section className="border rounded p-5 bg-light">
                                <div className="picture"
                                     onClick={() => this.uploadImg.current.click()}>
                                    <img className="profile-pic" src={profilePictureImg} alt="profile picture"/>
                                </div>
                                <div>
                                    <div className="form-group">
                                        <input type="file" ref={this.uploadImg} className="d-none" id="profilePicture"
                                               onChange={this.handleProfilePictureChange} name="profile-picture"/>
                                    </div>
                                </div>

                                <div className="infos m-1">
                                    <p className="name text-center font-weight-bold">{recruiter?.firstname} {recruiter?.lastname}</p>
                                </div>

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
                                <ContactForm emailDest={recruiter?.email}></ContactForm>
                            </section>
                        </div>
                    </div>

                    {(this.state.onViewJob || this.state.onChangeJobPost) &&
                    <Dialog open={this.state.onChangeJobPost}
                                                                                     onClose={this.updateArray}
                                                                                     aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center font-weight-bold">Post a Job</p></DialogTitle>
                        <DialogContent>
                            <JobPost jobPost={selectedJobPost}
                                     onFormSubmit={this.handleJobSubmit}
                                     onPostDelete={this.handleDelete}
                                     onClose={() => this.onCloseWindow()}/>
                        </DialogContent>
                    </Dialog>}


                    {selectedJobPost && !this.state.onChangeJobPost && <Dialog open={this.state.onViewJob}
                                                                               onClose={this.showJobPost}
                                                                               aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            <h3 className="text-center pt-3 font-weight-bold ">
                                {selectedJobPost.title}
                            </h3>
                            <small>
                                <h5 className="text-center m-0"><a href={selectedJobPost.url}>{selectedJobPost.companyName}</a></h5>
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


                </div>
            </div>
        )
    }
}

export default withRouter(ProfileRecruiter);
