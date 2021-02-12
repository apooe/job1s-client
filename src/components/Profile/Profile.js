import React, {Component} from 'react';
import {withRouter} from "react-router";
import picImage from '../../images/Unknown_person.jpg';
import {getInstance} from "../../helpers/httpInstance";

import './Profile.css';
import {AuthServiceFactory} from "../../services/authService";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from '@material-ui/icons/Add';
import FileUpload from "./ProfilePicture/FilesUploadComponent";
import Experience from "./Experiences/Experience";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const http = getInstance();

class Profile extends Component {

    _currentUser = null;

    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            onChangeInfo: false,
            onChangeExperiences: false,
            user: null,
            selectedExperience: null
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
    onClickAddExperience = () => {
        this.setState({onChangeExperiences: !this.state.onChangeExperiences, selectedExperience: null});

    }

    onClickUpdateExperience = (experience) => {
        this.setState({onChangeExperiences: !this.state.onChangeExperiences, selectedExperience: experience});

    }

    handleExperienceSubmit = (newExperience) => {
        console.log("HHH", newExperience);
        const {profile, selectedExperience} = this.state;
        const newProfile = {...profile};
        const isNewExperience = !selectedExperience;
        if (isNewExperience) {
            console.log("NEW")
            // Add
            newProfile.experience  = newProfile?.experience ? [...newProfile.experience, newExperience] : [newExperience];
        }else {
            console.log("UPDATE")

            // Update de larray
            newProfile.experience = newProfile?.experience.map(exp => exp._id === newExperience._id ? newExperience : exp);
        }

        console.log("HHH", newProfile);


        const url = '/profiles';
        http.put(url, newProfile).then(response => {
            this.setState({profile: newProfile, selectedExperience: null, onChangeExperiences: false});
        }).catch(error => {
            console.log(error?.response?.data);
        });
        this.setState({onChangeExperience: false})
    }

    render() {
        const {user, profile, selectedExperience} = this.state;
        return (
            <div>
                {profile ? <div className="container-profile">
                    <section className="container background-info-pic">
                        <div className="picture">
                            <img className="profile-pic" src={picImage} alt="profile picture"></img>
                        </div>
                        <div className="infos">
                            <h1 className="name">{user.firstname} {user.lastname}</h1>
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


                        <div className="education"><h1>Education</h1>
                            {this.state.onChangeInfo ?
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Education"
                                    multiline
                                    rows={4}
                                    onChange={e => this.handleProfileChange({education: e.target.value})}
                                    variant="outlined"
                                    fullWidth
                                    value={profile.education}
                                /> : profile.education}
                        </div>

                        <div className="experiences">
                            <h1>
                                Experiences &nbsp;
                                <AddIcon
                                    onClick={this.onClickAddExperience}>
                                </AddIcon>
                            </h1>
                            {
                                profile.experience && profile.experience.map(exp => <p onClick={() => this.onClickUpdateExperience(exp)}>{exp.companyName}</p>)
                            }

                        </div>

                        {this.state.onChangeInfo && <div>
                            <Button
                                color="default"
                                variant="contained"
                                id="btn-update-profile"
                                onClick={this.onSubmitUpdate}
                            >
                                Validate
                            </Button>
                        </div>}

                    </section>

                    <Dialog open={this.state.onChangeExperiences} onClose={() => this.setState({onChangeExperiences: false})} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><p className="text-center">Experience</p></DialogTitle>
                        <DialogContent>
                            <Experience experience={selectedExperience}
                                        onExperienceSubmit={this.handleExperienceSubmit}/>
                        </DialogContent>
                    </Dialog>

                </div> : <p>No data to display</p>}

                <FileUpload/>



            </div>

        )
    }
}

export default withRouter(Profile);
