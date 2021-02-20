import React, {Component} from 'react';
import {withRouter} from "react-router";
import picImage from '../../images/Unknown_person.jpg';
import {getInstance} from "../../helpers/httpInstance";
import './Profile.css';
import {AuthServiceFactory} from "../../services/authService";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from '@material-ui/icons/Add';
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
import ContactForm from "../ContactForm/ContactForm";

const http = getInstance();

const EDUCATION_ARRAY = "EDUCATION_ARRAY";
const EXPERIENCE_ARRAY = "EXPERIENCE_ARRAY";

class Profile extends Component {

    _currentUser = null;

    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            onChangeInfo: false,
            onChangeExperiences: false,
            onDeleteExperiences: false,
            onChangeEducations: false,
            onDeleteEducations: false,
            user: null,
            selectedExperience: null,
            selectedEducation: null,
            fileToUpload: null,
            uploadedFile: null,


        };

    }

    /**
     * Quand le html a ete init
     */
    componentDidMount() {
        const user = AuthServiceFactory.getInstance().getCurrentUser();
        this.setState({user});
        this.getProfile(user._id);

    }

    getProfile = (userId) => {
        const url = `/profiles/${userId}`;
        http.get(url).then(response => {
            console.log("data: ", response.data);
            this.setState({profile: response.data});
            console.log(this.state);
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    onSubmitUpdate = () => {
        const url = '/profiles';
        const {profile} = this.state;
        http.put(url, profile).then(response => {
            console.log("data: ", response.data);
        }).catch(error => {
            console.log(error?.response?.data);
        });
        this.setState({onChangeInfo: false})
    }

    handleProfileChange = (newValueObject) => {
        const oldProfile = {...this.state.profile}; // Deep Copy of the profile field
        const newProfile = {...oldProfile, ...newValueObject}; // Merge two profile
        this.setState({profile: newProfile});
    }

    onClickUpdateInfos = () => {
        this.setState({onChangeInfo: !this.state.onChangeInfo})
    }

    addDataArray = (type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({onChangeExperiences: !this.state.onChangeExperiences, selectedExperience: null}) :
            this.setState({onChangeEducations: !this.state.onChangeEducations, selectedEducation: null});

    }

    updateDataArray = (data, type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({onChangeExperiences: !this.state.onChangeExperiences, selectedExperience: data}) :
            this.setState({onChangeEducations: !this.state.onChangeEducations, selectedEducation: data});
    }

    deleteDataArray = (data, type) => {

        type === EXPERIENCE_ARRAY ?
            this.setState({onDeleteExperiences: !this.state.onDeleteExperiences, selectedExperience: data}) :
            this.setState({onDeleteEducations: !this.state.onDeleteEducations, selectedEducation: data});
    }

    handleExperienceSubmit = (newExperience) => {
        const {profile, selectedExperience} = this.state;
        const newProfile = {...profile};
        const isNewExperience = !selectedExperience;

        if (isNewExperience) {
            console.log("NEW")
            newProfile.experience = newProfile?.experience ? [...newProfile.experience, newExperience] : [newExperience];

        } else {
            console.log("UPDATE ")
            newProfile.experience = newProfile?.experience.map(exp => exp._id === newExperience._id ? newExperience : exp);
        }
        // On modifie le profile mais on attend quil click sur le button valide pour faire le PUT dans le serveur
        this.setState({profile: newProfile, selectedExperience: null, onChangeExperiences: false});

    }
    handleEducationSubmit = (newEducation) => {
        const {profile, selectedEducation} = this.state;
        const newProfile = {...profile};
        const isNewEducation = !selectedEducation;

        if (isNewEducation) {
            console.log("NEW educatiom")
            newProfile.education = newProfile?.education ? [...newProfile.education, newEducation] : [newEducation];

        } else {
            console.log("UPDATE education ")
            newProfile.education = newProfile?.education.map(educ => educ._id === newEducation._id ? newEducation : educ);
        }

        console.log("newprofile", newProfile);

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
        this.setState({fileToUpload: event.target.files[0]});
    }

    uploadFile = () => {
        if (!this.state.fileToUpload) {
            return null; // Not file to upload
        }

        //Format file before uploading (BECAUSE IS NOT JSON)
        const formData = new FormData();
        formData.append(
            "img",
            this.state.fileToUpload,
            this.state.fileToUpload.name
        );
        // TODO Ac changer avec env variable
        const url = '/upload';


        // Im not using HttpInstance because i not send data in json so i use default
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

    formatDate(date) {
        if (!date) {
            return null;
        }
        const obj = new Date(date);
        const options = {year: 'numeric', month: 'long'};
        return obj.toLocaleDateString("en-US", options);

    }

    render() {
        const {user, profile, selectedExperience, selectedEducation, fileToUpload} = this.state;

        // TODO a changer avec env variable
        const profilePictureImg = profile?.profileImg ? `http://localhost:8080${profile?.profileImg}` : picImage;
        return (
            <div className="wrapper-body-profile">
                {profile ? <div className="container profile">

                    <section className="container background-info-pic">
                        <div className="picture">
                            <img className="profile-pic" src={profilePictureImg} alt="profile picture"></img>
                        </div>
                        <div className="infos">
                            <p className="name">{user.firstname} {user.lastname}</p>
                            <p className="city">{user.city}</p>
                        </div>
                        <EditIcon
                            id="btn-update-profile"
                            onClick={this.onClickUpdateInfos}>
                            Update profile
                        </EditIcon>
                    </section>


                    <section className="container profile-infos">
                        <div className="container description">
                            <h1 className="category-profile">Description</h1>
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
                        </div>

                        <hr className="between-category-separator"/>
                        <div className="container education">
                            <h1 className="category-profile">
                                Education &nbsp;
                                {this.state.onChangeInfo && <AddIcon
                                    onClick={() => this.addDataArray(EDUCATION_ARRAY)}>
                                </AddIcon>}
                            </h1>
                            {
                                profile.education && profile.education.map(formation =>

                                    <div key={uuid()}>

                                        <h4 className="company-educ-name">{formation.collegeName}</h4>
                                        {this.state.onChangeInfo &&
                                        <div style={{float: "right"}}>
                                            <EditIcon
                                                fontSize="small"
                                                onClick={() => this.updateDataArray(formation, EDUCATION_ARRAY)}>
                                            </EditIcon> &nbsp;
                                            <DeleteIcon
                                                fontSize="small"
                                                onClick={() => this.deleteDataArray(formation, EDUCATION_ARRAY)}>

                                            </DeleteIcon>
                                        </div>
                                        }
                                        <p className="position-type">{formation.degree}</p>
                                        <p className="date">{this.formatDate(formation.startDate)} - {this.formatDate(formation.endDate)} </p>

                                    </div>)
                            }

                        </div>

                        <hr className="between-category-separator"/>
                        <div className="container experiences">
                            <h1 className="category-profile">
                                Experiences &nbsp;
                                {this.state.onChangeInfo && <AddIcon
                                    onClick={() => this.addDataArray(EXPERIENCE_ARRAY)}>
                                </AddIcon>}
                            </h1>
                            {
                                profile.experience && profile.experience.map(exp =>

                                    <div key={uuid()}>

                                        <h4 className="company-educ-name">{exp.companyName}</h4>
                                        {this.state.onChangeInfo &&
                                        <div style={{float: "right"}}>
                                            <EditIcon
                                                fontSize="small"
                                                onClick={() => this.updateDataArray(exp, EXPERIENCE_ARRAY)}>
                                            </EditIcon> &nbsp;
                                            <DeleteIcon
                                                fontSize="small"
                                                onClick={() => this.deleteDataArray(exp, EXPERIENCE_ARRAY)}>
                                            </DeleteIcon>
                                        </div>
                                        }
                                        <p className="position-type">{exp.position}</p>
                                        <p className="date">{this.formatDate(exp.startDate)} - {this.formatDate(exp.endDate)} </p>
                                        <p className="description-exp">{exp.description}</p>
                                        <hr id="line"/>
                                    </div>)
                            }

                        </div>

                        {this.state.onChangeInfo &&
                        <div>
                            <h1>Upload Profile Picture</h1>
                            <div className="form-group">
                                <input type="file" className="form-control" id="profilePicture"
                                       onChange={this.handleProfilePictureChange} name="profile-picture"/>
                            </div>
                            <div className="form-group">
                                {fileToUpload && <button className="btn btn-primary" type="submit"
                                                         onClick={this.uploadFile}>Upload</button>
                                }
                            </div>
                        </div>}

                        {this.state.onChangeInfo && <div className="mt-5">
                            <Button
                                color="default"
                                variant="contained"
                                id="btn-validate-profile"
                                onClick={this.onSubmitUpdate}>
                                Validate
                            </Button>
                        </div>}


                    </section>


                    <Dialog open={this.state.onChangeInfo && this.state.onChangeExperiences}
                            onClose={this.updateDataArray}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center">Experience</p></DialogTitle>
                        <DialogContent>
                            <Experience experience={selectedExperience}
                                        onExperienceSubmit={this.handleExperienceSubmit}
                                        onClose={() => this.onCloseWindowChange(EXPERIENCE_ARRAY)}/>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={this.state.onChangeInfo && this.state.onChangeEducations}
                            onClose={this.updateDataArray}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center">Education</p></DialogTitle>
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

                </div> : <p>No data to display</p>}

                <section className="container contact-form">
                    <ContactForm emailDest={user?.email}></ContactForm>


                </section>


            </div>

        )
    }
}

export default withRouter(Profile);
