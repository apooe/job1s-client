import "./Apply.css"
import React, {Component} from 'react';
import {AuthServiceFactory} from "../../services/authService";
import {getInstance} from "../../helpers/httpInstance";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {AppContext, AUTH_TYPE_JOB_SEEKER} from "../../AppContext";


const http = getInstance();

const useStyles = (theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    }
});

class Apply extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            currentRecruiter: null,
            applyForm: {
                email: '',
                phone: 0,
                resume: null
            },
            fileToUpload: null,
            uploadedFile: null,
            nextStep: false,
            steps: null,
            changeResume:false
        }
        this.uploadImg = React.createRef();
    }


    async componentDidMount() {

        const user = AuthServiceFactory.getInstance().getCurrentUser();
        const url = `/users/${user._id}`;

        await http.get(url).then(({data}) => {

            this.setState({user: data, currentRecruiter: this.props.currentRecruiter, steps: this.getSteps()});
            this.handleFormChange({
                email: data.email,
                phone: data.phone,
                firstname: data.firstname,
                lastname: data.lastname,
                resume: data.resume
            });

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    handleFormChange = async (newValue) => {

        const oldForm = {...this.state.applyForm}; // Deep Copy of the profile field
        const newApplyForm = {...oldForm, ...newValue};
        await this.setState({applyForm: newApplyForm})

    }


    handleResumeChange = (event) => {

        // Get File Infos
        const fileToUpload = event.target.files[0];
        this.setState({fileToUpload, changeResume: true});
        this.uploadFile(fileToUpload);
    }

    setResume = async () => {


        const oldUser = {...this.state.user};
        const userRecord = {...oldUser, resume: this.state.user.resume};
        await this.setState({user: userRecord});
        await this.onSaveInfo(this.state.user);

    }

    onSaveInfo = async (user) => {

        const url = '/users';
        await http.put(url, user).then(response => {
            this.setState({user: response.data});
        }).catch(error => {
            console.log(error?.response?.data);
        });

        await this.context.setContext({currentUser: this.state.user});


    }

    uploadFile = (fileToUpload) => {

        if (!fileToUpload) {
            return null; // Not file to upload
        }

        const formData = new FormData();
        formData.append(
            "resume",
            fileToUpload,
            fileToUpload.name
        );

        const url = '/uploadResume';
        http.post(url, formData).then(({data}) => {

            this.handleFormChange({resume: data.link});


            const newUser = {...this.state.user};
            newUser.resume = data.link;
            this.setState({user: newUser});

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }
    handleSubmit = async (e) => {

        e.preventDefault();
        await this.setResume();

        if (this.state.currentStep === 1) {
            this.setState({currentStep: 2});
            return;
        }


        const url = "/users/sendFormToUser";
        const data = {...this.state.applyForm, emailDest: this.state.currentRecruiter.email};

        await http.post(url, data).then((response) => {
            if (response.data.status === "sent") {
                this.setState({fileToUpload: null, changeResume:false});
            } else if (response.data.status === "failed") {
                console.log(response.data.status);
            }
        }).catch(error => {
            console.log(error?.response?.data);
        });
        this.props.onSubmit();
    }

    handleCurrentStep = (e) => {

        e.preventDefault();
        this.setState({nextStep: !this.state.nextStep});
    }

    getSteps() {
        return ['Add your contact information', 'Add your resume'];
    }

    render() {
        const {classes} = this.props;
        const {user, applyForm, fileToUpload, nextStep, steps, changeResume} = this.state;
        const imgSrc = `${process.env.REACT_APP_API_BASE_URL}${user?.picture}`;



        if (!user) {
            return null;
        }

        return (
            <div className="container">
                <div className={classes.root} id="stepper">
                    <Stepper activeStep={nextStep ? 1 : 0} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>

                <form onSubmit={this.handleSubmit}>

                    {!nextStep ?
                        <div>
                            <h5>Contact Info</h5>
                            <div className="row">
                                <div className="col-3 pb-4">
                                    <img className="pic-jobseeker-apply" src={imgSrc} alt="profile picture"/>
                                </div>
                                <div className="col p-0 pt-4">
                                    <div className=""><h6
                                        className="apply-name-contact">{user.firstname} {user.lastname}</h6>
                                        <p className="apply-city-contact">{user.city}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label>Email address*</label>
                                        <input type="email" className="form-control form-control-sm input-apply"
                                               required value={applyForm.email}
                                               onChange={e => this.handleFormChange({email: e.target.value})}/>
                                        <small className="form-text text-muted">We'll never share your email with
                                            anyone else.</small>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>Phone number</label>
                                    <input type="text"
                                           required value={applyForm.phone}
                                           className="form-control input-apply "
                                           onChange={e => this.handleFormChange({phone: e.target.value})}/>
                                </div>
                            </div>
                            <div className="separator-apply"></div>
                            <button type="button" className="btn float-right button-apply"
                                    onClick={this.handleCurrentStep}>Next
                                <ArrowForwardIosIcon fontSize="small"></ArrowForwardIosIcon>
                            </button>
                        </div>
                        :
                        <div>
                            <div className="row mt-3">
                                <div className="col">
                                    <h5>Resume</h5>
                                    <p className="form-text text-muted mb-1">Please include a resume.</p>
                                    <label className="label-upload mb-0 mr-2" htmlFor="actual-btn">Upload resume
                                        <i className="pl-2 fa fa-upload "></i>
                                    </label>
                                    <input type="file"
                                           ref={this.uploadImg}
                                           className="form-control "
                                           id="actual-btn"
                                           name="avatar"
                                           hidden
                                           onChange={this.handleResumeChange}/>


                                    {fileToUpload && <span>{fileToUpload.name}</span>}
                                    {user?.resume  && !changeResume && <t className="pdf_icon"><PictureAsPdfIcon color="action"/> my resume</t>
                                    }

                                    <small className="form-text text-muted ">DOC, DOCX, PDF</small>
                                </div>


                            </div>
                            <div className="pt-5">
                                <div className="separator-apply"></div>
                                <button type="button" className="btn btn-link button-back"
                                        onClick={this.handleCurrentStep}>
                                    Back
                                </button>
                                <button type="submit" className="btn btn-link button-apply float-right ">
                                    Submit
                                    <ArrowForwardIosIcon fontSize="small">
                                    </ArrowForwardIosIcon></button>
                            </div>
                        </div>
                    }
                </form>


            </div>
        )
    }

}

export default withStyles(useStyles)(Apply)

