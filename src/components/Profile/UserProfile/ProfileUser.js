import React, {Component} from 'react';
import {withRouter} from "react-router";
import picImage from '../../../images/Unknown_person.jpg';
import {getInstance} from "../../../helpers/httpInstance";
import './ProfileUser.css';
import {AuthServiceFactory} from "../../../services/authService";
import TextField from "@material-ui/core/TextField";
import Experience from "./Experiences/Experience";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteExperienceControl from "./Experiences/DeleteExperienceControl";
import {v4 as uuid} from "uuid";
import Education from "./Education/Education";
import DeleteEducationControl from "./Education/DeleteEducationControl";
import ContactForm from "../../ContactForm/ContactForm";
import IconButton from "@material-ui/core/IconButton";
import WorkIcon from '@material-ui/icons/Work';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Avatar from "@material-ui/core/Avatar";
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import {Divider} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CallIcon from '@material-ui/icons/Call';
import ContactInfo from "../ContactInfos/ContactInfo";
import {AppContext} from "../../../AppContext";
import Loader from "../../Loader";

const http = getInstance();
const EDUCATION_ARRAY = "EDUCATION_ARRAY";
const EXPERIENCE_ARRAY = "EXPERIENCE_ARRAY";

class ProfileUser extends Component {

    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            onChangeProfileInfo: false,
            onChangeExperiences: false,
            onDeleteExperiences: false,
            onChangeEducations: false,
            onDeleteEducations: false,
            originalSelectedEducation: null,
            user: null,
            selectedExperience: null,
            originalSelectedExperience: null,
            selectedEducation: null,
            fileToUpload: null,
            uploadedFile: null,
            isMyProfile: true,
            onContactinfo: false,

        };
        this.uploadImg = React.createRef();
    }

    /**
     * Quand le html a ete init
     */
    async componentDidMount() {

        const user = AuthServiceFactory.getInstance().getCurrentUser();
        this.props.match.params.id ? // if user visit other profiles or his profile
            await this.isVisitedProfile(false, `/users/${this.props.match.params.id}`) :
            await this.isVisitedProfile(true, `/users/${user._id}`)

    }

    isVisitedProfile = async (isMyProfile, url) => {

        await http.get(url).then(response => {
            this.setState({user: response.data, isMyProfile: isMyProfile});
            this.getProfile(this.state.user._id);
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    getProfile = (userId) => {
        const url = `/profiles/${userId}`;
        http.get(url).then(response => {
            this.setState({profile: response.data});

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    handlePictureChange = async () => {
        if (this.state.profile.profileImg) {
            const oldUser = {...this.state.user};
            const userRecord = {...oldUser, picture: this.state.profile.profileImg};
            await this.setState({user: userRecord});
            await this.onSaveInfo(this.state.user);
        }
    }

    onSubmitUpdate = async () => {
        const url = '/profiles';
        const {profile} = this.state;
        http.put(url, profile).then(response => {
        }).catch(error => {
            console.log(error?.response?.data);
        });
        this.setState({onChangeInfo: false});
        await this.handlePictureChange();

    }

    handleProfileChange = (newValueObject) => {
        const oldProfile = {...this.state.profile}; // Deep Copy of the profile field
        const newProfile = {...oldProfile, ...newValueObject}; // Merge two profile
        this.setState({profile: newProfile});
    }

    addDataArray = (type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({
                onChangeExperiences: !this.state.onChangeExperiences,
                selectedExperience: null,
                originalSelectedExperience: null
            }) :
            this.setState({
                onChangeEducations: !this.state.onChangeEducations,
                selectedEducation: null,
                originalSelectedEducation: null
            });

    }

    updateDataArray = (data, type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({
                onChangeExperiences: !this.state.onChangeExperiences,
                selectedExperience: data,
                originalSelectedExperience: {...data}
            }) :
            this.setState({
                onChangeEducations: !this.state.onChangeEducations,
                selectedEducation: data,
                originalSelectedEducation: {...data}
            });
    }

    deleteDataArray = (data, type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({
                onDeleteExperiences: !this.state.onDeleteExperiences,
                selectedExperience: data,
                originalSelectedExperience: {...data}
            }) :
            this.setState({
                onDeleteEducations: !this.state.onDeleteEducations,
                selectedEducation: data,
                originalSelectedEducation: {...data}
            });
    }

    handleExperienceSubmit = (newExperience) => {

        const {profile, selectedExperience} = this.state;
        const newProfile = {...profile};
        const isNewExperience = !selectedExperience;

        if (isNewExperience) {
            newProfile.experience = newProfile?.experience ? [...newProfile.experience, newExperience] : [newExperience];

        } else {

            newProfile.experience = newProfile?.experience.map(
                exp => exp.companyName === this.state.originalSelectedExperience.companyName &&
                exp.startDate === this.state.originalSelectedExperience.startDate ? newExperience : exp);
        }
        // On modifie le profile mais on attend quil click sur le button valide pour faire le PUT dans le serveur
        this.setState({profile: newProfile, selectedExperience: null, onChangeExperiences: false});

    }

    handleEducationSubmit = (newEducation) => {
        const {profile, selectedEducation} = this.state;
        const newProfile = {...profile};
        const isNewEducation = !selectedEducation;

        if (isNewEducation) {
            newProfile.education = newProfile?.education ? [...newProfile.education, newEducation] : [newEducation];

        } else {
            newProfile.education = newProfile?.education.map(
                educ => educ.collegeName === this.state.originalSelectedEducation.collegeName ? newEducation : educ);
        }


        // On modifie le profile mais on attend quil click sur le button valide pour faire le PUT dans le serveur
        this.setState({profile: newProfile, selectedEducation: null, onChangeEducations: false});
    }

    handleDelete = (dataToDelete, type) => {

        const {profile} = this.state;
        const newProfile = {...profile};

        if (type === EXPERIENCE_ARRAY) {
            newProfile.experience = newProfile.experience.filter(exp => exp !== dataToDelete);
            this.setState({profile: newProfile, selectedExperience: null, onDeleteExperiences: false});
        } else {
            newProfile.education = newProfile.education.filter(educ => educ !== dataToDelete);
            this.setState({profile: newProfile, selectedEducation: null, onDeleteEducations: false});
        }

    }

    handleProfilePictureChange = (event) => {
        // Get File Infos
        const fileToUpload = event.target.files[0];
        this.setState({fileToUpload});
        this.uploadFile(fileToUpload);
    }

    uploadFile = (fileToUpload) => {
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
        // TODO Ac changer avec env variable
        const url = '/uploadImg';

        http.post(url, formData).then(({data}) => {
            // Change profile info
            const newProfile = {...this.state.profile};
            // Set link of the proile
            newProfile.profileImg = data.link;
            this.setState({profile: newProfile, fileToUpload: null});
        })
    }

    onCloseWindowDelete = (type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({onDeleteExperiences: false}) :
            this.setState({onDeleteEducations: false});
    };

    onCloseWindowChange = (type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({onChangeExperiences: false}) :
            this.setState({onChangeEducations: false});

    };

    onClickUpdateInfos = () => {
        this.setState({onChangeInfo: !this.state.onChangeInfo})
    }

    formatDate(date) {
        if (!date) {
            return null;
        }
        const obj = new Date(date);
        const options = {year: 'numeric', month: 'long'};
        return obj.toLocaleDateString("en-US", options);

    }

    onSaveInfo = async (user) => {

        const url = '/users';
        await http.put(url, user).then(response => {
            this.setState({user: response.data});
        }).catch(error => {
            console.log(error?.response?.data);
        });

        await this.context.setContext({currentUser: this.state.user});
        this.setState({onChangeInfo: false});

    }

    onContactInfo = () => {
        this.setState({onContactInfo: true});
    };

    onCloseWindow = () => {
        this.setState({ onContactInfo: false})
    };

    render() {
        const {user, profile, selectedExperience, selectedEducation} = this.state;


        // TODO a changer avec env variable
        const profilePictureImg = profile?.profileImg ? `${profile?.profileImg}` : picImage;
        return (
            <div>

                {profile ? <div className="container mt-5">

                    <div className="row">
                        <div className="col-12">
                            <section className="presentation-section border rounded p-2">
                                <div className="picture"
                                     onClick={() => this.state.onChangeInfo && this.uploadImg.current.click()}>
                                    {this.state.onChangeInfo ?
                                    <img className="profile-pic-edit" src={profilePictureImg} alt="profile picture"/>:
                                        <img className="profile-pic" src={profilePictureImg} alt="profile picture"/>
                                    }
                                    {this.state.onChangeInfo &&
                                    <div className="change-img"></div>}
                                </div>

                                <div className="infos m-1 text-center">
                                    <p className="name">{user.firstname} {user.lastname}</p>
                                    <p className="job">{user.job}</p>
                                    {user.phone && <p className="phone">
                                        <CallIcon fontSize="small"/>{user.phone}</p>}
                                    <p className="city">{user.city}</p>

                                    <a href="#" className="contact-info-btn"
                                            onClick={this.onContactInfo}>Contact Info
                                    </a>
                                </div>


                                {this.state.isMyProfile &&
                                <div className="row">
                                    <div className="col-12">


                                        {this.state.onChangeInfo ?<div className=" float-right p-2 text-info">
                                            <button className="btn btn-info" onClick={this.onSubmitUpdate}>
                                                update
                                            </button>
                                        </div> :

                                            <IconButton aria-label="edit" className="float-right p-2 text-info"
                                                        onClick={this.onClickUpdateInfos}>

                                                <EditIcon>
                                                    fontSize="small"
                                                    Update profile
                                                </EditIcon>
                                            </IconButton>
                                        }
                                    </div>
                                </div>}


                            </section>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12">
                            <section className="bg-light rounded p-5 border description-user ">
                                <Avatar className="bg-info mx-auto">
                                    <ImportContactsIcon/>
                                </Avatar>
                                <h1 className="category-profile mb-3 p-0 ">Description</h1>
                                {this.state.onChangeInfo ?
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Description"
                                        multiline
                                        rows={4}
                                        onChange={e => this.handleProfileChange({description: e.target.value})}
                                        variant="outlined"
                                        fullWidth
                                        value={profile.description}
                                    /> : profile.description}
                            </section>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12">
                            <section className="bg-light rounded p-5 border">
                                <div className="education">
                                    <Avatar className="bg-info mx-auto">
                                        <AccountBalanceIcon/>
                                    </Avatar>
                                    <h1 className="category-profile mb-4 p-0 ">
                                        Education &nbsp;
                                        {this.state.onChangeInfo &&
                                        <IconButton aria-label="add" className="text-info"
                                                    onClick={() => this.addDataArray(EDUCATION_ARRAY)}>
                                            <AddCircleOutlineIcon>
                                            </AddCircleOutlineIcon></IconButton>}
                                    </h1>
                                    {
                                        profile.education && profile.education.map((formation, index) =>

                                            <div className="mt-2 pl-2" key={uuid()}>

                                                <h4 className="company-educ-name"><a href={formation.link}
                                                                                     target="_blank">{formation.collegeName}</a>
                                                </h4>
                                                {this.state.onChangeInfo &&
                                                <div style={{float: "right"}}>
                                                    <IconButton aria-label="edit" className="text-info"
                                                                onClick={() => this.updateDataArray(formation, EDUCATION_ARRAY)}>
                                                        <EditIcon fontSize="small"></EditIcon>
                                                    </IconButton>
                                                    <IconButton aria-label="delete" className="text-danger"
                                                                onClick={() => this.deleteDataArray(formation, EDUCATION_ARRAY)}>
                                                        <DeleteIcon
                                                            fontSize="small">

                                                        </DeleteIcon>
                                                    </IconButton>
                                                </div>
                                                }
                                                <p className="position-type">{formation.degree}</p>
                                                <p className="date"> {this.formatDate(formation.startDate)} - {this.formatDate(formation.endDate)} </p>
                                                {index !== profile.education.length - 1 &&
                                                <hr className="between-category-separator"/>}

                                            </div>)
                                    }

                                </div>
                                <Divider className="my-5"/>
                                <div className="experiences">
                                    <Avatar className="bg-info mx-auto">
                                        <WorkIcon/>
                                    </Avatar>
                                    <h1 className="category-profile mb-4 p-0 ">
                                        Experiences &nbsp;
                                        {this.state.onChangeInfo &&
                                        <IconButton aria-label="add" className="text-info"
                                                    onClick={() => this.addDataArray(EXPERIENCE_ARRAY)}>
                                            <AddCircleOutlineIcon>
                                            </AddCircleOutlineIcon></IconButton>}
                                    </h1>
                                    {
                                        profile.experience && profile.experience.map((exp, index) =>

                                            <div key={uuid()} className="mt-2 pl-2">

                                                <h4 className="company-educ-name"><a href={exp.link}
                                                                                     target="_blank">{exp.companyName}</a>
                                                </h4>
                                                {this.state.onChangeInfo &&
                                                <div style={{float: "right"}}>
                                                    <IconButton aria-label="edit" className="text-info"
                                                                onClick={() => this.updateDataArray(exp, EXPERIENCE_ARRAY)}>

                                                        <EditIcon
                                                            fontSize="small">
                                                        </EditIcon>
                                                    </IconButton>
                                                    <IconButton aria-label="delete" className="text-danger"
                                                                onClick={() => this.deleteDataArray(exp, EXPERIENCE_ARRAY)}>
                                                        <DeleteIcon
                                                            fontSize="small">
                                                        </DeleteIcon>
                                                    </IconButton>
                                                </div>
                                                }
                                                <p className="position-type">{exp.position}</p>
                                                <p className="date">{this.formatDate(exp.startDate)} - {this.formatDate(exp.endDate)} </p>
                                                <p className="description-exp">{exp.description}</p>
                                                {index !== profile.experience.length - 1 &&
                                                <hr className="between-category-separator"/>}

                                            </div>)
                                    }

                                </div>

                                {this.state.onChangeInfo &&
                                <div>
                                    <div className="form-group">
                                        <input type="file" ref={this.uploadImg} className="d-none" id="profilePicture"
                                               onChange={this.handleProfilePictureChange} name="profile-picture"/>
                                    </div>
                                </div>}

                                {this.state.onChangeInfo && <div className=" text-center mt-5">
                                    <button className="btn btn-info w-50" onClick={this.onSubmitUpdate}>
                                        Save
                                    </button>
                                </div>}

                            </section>
                        </div>

                    </div>

                    <div className="row mt-5 mb-2">
                        <div className="col-12">
                            <section className="bg-light rounded p-5 border contact-form">
                                <ContactForm profileFirstName={user?.firstname}
                                             profileLastName={user?.lastname}
                                             emailDest={user?.email}></ContactForm>


                            </section>
                        </div>
                    </div>


                    <Dialog open={this.state.onChangeInfo && this.state.onChangeExperiences}
                            onClose={this.updateDataArray}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center title-dialog">Experience</p>
                        </DialogTitle>
                        <DialogContent>
                            <Experience experience={selectedExperience}
                                        onExperienceSubmit={this.handleExperienceSubmit}
                                        onClose={() => this.onCloseWindowChange(EXPERIENCE_ARRAY)}/>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={this.state.onChangeInfo && this.state.onChangeEducations}
                            onClose={this.updateDataArray}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center title-dialog">Education</p>
                        </DialogTitle>
                        <DialogContent>
                            <Education education={selectedEducation}
                                       onEducationSubmit={this.handleEducationSubmit}
                                       onClose={() => this.onCloseWindowChange(EDUCATION_ARRAY)}/>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={this.state.onChangeInfo && this.state.onDeleteExperiences}
                            onClose={this.deleteDataArray}
                            aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <DeleteExperienceControl experience={selectedExperience}
                                                     type={EXPERIENCE_ARRAY}
                                                     onExperienceSubmit={this.handleDelete}
                                                     onClose={() => this.onCloseWindowDelete(EXPERIENCE_ARRAY)}/>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={this.state.onChangeInfo && this.state.onDeleteEducations}
                            onClose={this.deleteDataArray}
                            aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <DeleteEducationControl education={selectedEducation}
                                                    type={EDUCATION_ARRAY}
                                                    onEducationSubmit={this.handleDelete}
                                                    onClose={() => this.onCloseWindowDelete(EDUCATION_ARRAY)}/>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={this.state.onContactInfo}
                            onClose={this.onCloseWindow}
                            aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <button type="button" className="close" aria-label="Close"
                                    onClick={this.onCloseWindow}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <ContactInfo onSubmit={this.onSaveInfo} user={user}/>
                        </DialogContent>
                    </Dialog>


                </div> : <Loader />}


            </div>


        )
    }
}

export default withRouter(ProfileUser);
