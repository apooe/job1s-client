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
import DeleteExperience from "./Experiences/DeleteExperience";
import {v4 as uuid} from "uuid";

const http = getInstance();

class Profile extends Component {

    _currentUser = null;

    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            onChangeInfo: false,
            onChangeExperiences: false,
            onDeleteExperiences: false,
            user: null,
            selectedExperience: null,
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
    onClickAddIcon = () => {
        this.setState({onChangeExperiences: !this.state.onChangeExperiences, selectedExperience: null});
    }

    onClickUpdate = (experience) => {
        this.setState({onChangeExperiences: !this.state.onChangeExperiences, selectedExperience: experience});

    }

    onClickDelete = (data, mireille, selectedValue) => {
        this.setState({mireille: !mireille, selectedValue: data});
    }

    handleExperienceSubmit = (newExperience) => {
        const {profile, selectedExperience} = this.state;
        const newProfile = {...profile};
        const isNewExperience = !selectedExperience;

        if (isNewExperience) {
            console.log("NEW")
            // Add
            newProfile.experience = newProfile?.experience ? [...newProfile.experience, newExperience] : [newExperience];

        }
        else{
            console.log("UPDATE ")

            // Update de larray
            newProfile.experience = newProfile?.experience.map(exp => exp._id === newExperience._id ? newExperience : exp);
        }
        console.log("HHH", newProfile);

        // On modifie le profile mais on attend quil click sur le button valide pour faire le PUT dans le serveur
        this.setState({profile: newProfile, selectedExperience: null, onChangeExperiences: false});
    }

    handleExperienceDelete = (newExperience) => {
        const {profile} = this.state;
        const newProfile = {...profile};
        newProfile.experience = newProfile.experience.filter(exp => exp._id !== newExperience._id);
       this.setState({profile: newProfile, selectedExperience: null, onDeleteExperiences: false});
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

    onCloseWindowDelete = () =>{

        this.setState({onDeleteExperiences : false});
    };

    onCloseWindowChange = () =>{

        this.setState({onChangeExperiences : false});
    };

    formatDate(date) {
        if(!date) {
            return null;
        }
        const obj = new Date(date);
        const options = { year: 'numeric', month: 'long' };
        return obj.toLocaleDateString("en-US", options);

    }


    render() {
        const {user, profile, selectedExperience, fileToUpload} = this.state;
        // TODO a changer avec env variable
        const profilePictureImg = profile?.profileImg ? `http://localhost:8080${profile?.profileImg}` : picImage;
        return (
            <div>
                {profile ? <div className="container-profile">
                    <section className="container background-info-pic">
                        <div className="picture">
                            <img className="profile-pic" src={profilePictureImg} alt="profile picture"></img>
                        </div>
                        <div className="infos">
                            <h2 className="name">{user.firstname} {user.lastname}</h2>
                            <h3 className="city">{user.city}</h3>
                        </div>
                        <Button
                            color="default"
                            variant="contained"
                            id="btn-update-profile"
                            onClick={this.onClickUpdateInfos}>
                            Update profile
                        </Button>
                    </section>


                    <section className="second-part">
                        <div className="description"><h1>Description</h1>
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


                        <div className="education">
                            <h1>
                                Education &nbsp;
                                {this.state.onChangeInfo && <AddIcon
                                    onClick={this.onClickAddIcon}>
                                </AddIcon>}
                            </h1>
                            {
                                profile.education && profile.education.map(exp =>

                                    <div key={uuid()}>

                                        <h4 className="education-exp">{exp.collegeName}</h4>
                                        {this.state.onChangeInfo &&
                                        <div style={{float:"right"}}>
                                            <EditIcon
                                                fontSize="small"
                                                onClick={() => this.onClickUpdate(exp)}>
                                            </EditIcon> &nbsp;
                                            <DeleteIcon
                                                fontSize="small"
                                                onClick={() => this.onClickDelete(exp, this.state.onDeleteExperiences, this.state.selectedExperience)}>

                                            </DeleteIcon>
                                        </div>
                                        }
                                        <p className="degree-exp">{exp.degree}</p>
                                        <p className="date-exp">{this.formatDate(exp.startDate)} - {this.formatDate(exp.endDate)} </p>

                                    </div>)
                            }

                        </div>


                        <div className="experiences">
                            <h1>
                                Experiences &nbsp;
                                {this.state.onChangeInfo && <AddIcon
                                    onClick={this.onClickAddIcon}>
                                </AddIcon>}
                            </h1>
                            {
                                profile.experience && profile.experience.map(exp =>

                                    <div key={uuid()}>

                                        <h4 className="company-exp">{exp.companyName}</h4>
                                        {this.state.onChangeInfo &&
                                        <div style={{float:"right"}}>
                                            <EditIcon
                                                fontSize="small"
                                                onClick={() => this.onClickUpdate(exp)}>
                                            </EditIcon> &nbsp;
                                            <DeleteIcon
                                                fontSize="small"
                                                onClick={() => this.onClickDelete(exp)}>
                                            </DeleteIcon>
                                        </div>
                                        }
                                        <p className="position-exp">{exp.position}</p>
                                        <p className="date-exp">{this.formatDate(exp.startDate)} - {this.formatDate(exp.endDate)} </p>

                                        <p className="description-exp">{exp.description}</p>
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
                                id="btn-update-profile"
                                onClick={this.onSubmitUpdate}>
                                Validate
                            </Button>
                        </div>}


                    </section>

                    <Dialog open={this.state.onChangeInfo && this.state.onChangeExperiences}
                            onClose={this.onClickUpdate}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center">Experience</p></DialogTitle>
                        <DialogContent>
                            <Experience experience={selectedExperience}
                                        onExperienceSubmit={this.handleExperienceSubmit}
                                        onClose={this.onClickUpdate}/>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={this.state.onChangeInfo && this.state.onDeleteExperiences}
                            onClose={this.onClickDelete}
                            aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <DeleteExperience experience={selectedExperience}
                                        onExperienceSubmit={this.handleExperienceDelete} onClose={this.onClickDelete}/>
                        </DialogContent>
                    </Dialog>

                </div> : <p>No data to display</p>}


            </div>

        )
    }
}

export default withRouter(Profile);
