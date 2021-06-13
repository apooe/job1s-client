import {getInstance} from "../../helpers/httpInstance";
import React, {Component} from "react";
import {withRouter} from "react-router";
import {v4 as uuid} from "uuid";
import './JobPostsList.css';
import LaunchIcon from '@material-ui/icons/Launch';
import defaultPic from "../../images/unknown-company.PNG";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Apply from "../Apply/Apply";
import {AppContext, AUTH_TYPE_JOB_SEEKER} from "../../AppContext";
import Loader from "../Loader";

const http = getInstance();

class JobPostsList extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            recruiters: null,
            onclickJobPost: false,
            currentJobPost: null,
            currentRecruiter: null,
            onApply: false,
            jobposts: null,
            onSearch: false,
            user: null
        };

    }

    async componentDidMount() {
        const {currentUser, userType} = await this.context.context;//important
        this.getRecruitersJobPosts();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            console.log("URL CHANGED", this.state);
            this.getRecruitersJobPosts();
        }
    }

    getRecruitersJobPosts = async () => {

        const {currentUser} = await this.context.context;
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('job')) {
            this.getJobParam();
        } else {
            this.setState({user: currentUser});
            const {job} = this.state.user;
            this.getJobPosts(job || ""); // or just put recruitersMatch(); and "" if recruiter
        }

    }
    getJobParam = async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const jobSearch = urlParams.get('job');
        await this.getJobPosts(jobSearch);
        //await this.getJobsTitle(jobSearch);
    }

    getJobPosts = async (jobSearch) => {

        const url = `/recruiters/search/?job=${jobSearch}`;
        await http.get(url).then(({data}) => {
            this.handleChangeRecruiters(data);
            const recruiters = this.state.recruiters;

            if (recruiters.length !== 0) {
                const firstJp = recruiters[0]?.jobPosts[0];
                this.setState({currentJobPost: firstJp, currentRecruiter: recruiters[0]});
            } else {
                //if array of recruiters empty => fill with all recruiters
                this.getJobPosts("");
            }

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    handleChangeRecruiters = async (newRecruiters) => {

        await this.setState({recruiters: newRecruiters});
    }

    getAllRecruiters = async () => {
        const url = `/recruiters`;
        await http.get(url).then(response => {
            this.setState({
                recruiters: response.data,
                currentJobPost: response.data[0].jobPosts[0],
                currentRecruiter: response.data[0]
            });

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    recruitersMatch = async () => {

        const {currentUser, userType} = await this.context.context;
        this.setState({user: currentUser});
        const {job} = this.state.user;

        try {
            const url = `/recruiters/search/?job=${job}`;
            const response = await http.get(url);
            this.setState({
                recruiters: response.data,
                currentJobPost: response.data[0].jobPosts[0],
                currentRecruiter: response.data[0]
            });

        } catch (e) {
            console.log(e?.response?.data);
        }
    }

    onClickJobPost = (jobPost, recruiter) => {
        this.setState({currentJobPost: jobPost, currentRecruiter: recruiter})
    }

    onApply = () => {
        this.setState({onApply: !this.state.onApply});
    }

    onCloseWindow = () => {

        this.setState({onApply: false});

    };


    render() {

        const {userType} = this.context.context;
        const {recruiters, currentJobPost, currentRecruiter, onApply} = this.state;


        if (!recruiters) {
            return <Loader/>;
        }

        return (

            <div className="py-md-3">
                <div className="container  bg-light border rounded p-md-3">

                    {recruiters.length === 0 && <div>there is no job Post</div>}

                    <div className="row">
                        <h1 className="job-title-head d-md-none"><span>JOB POSTS</span></h1>
                    </div>

                    <div className="row  flex-row-reverse flex-md-row mt-4 contain-jpList  ">

                        <div className="col-12 col-md-5 jobPost-list ">
                            {recruiters.map((recruiter, index) =>
                                <div key={uuid()} className="row">
                                    <div className="col-12 ">

                                        {recruiter.jobPosts && recruiter.jobPosts.map((jp) =>
                                            <div key={uuid()} className="one-jp border pl-3"
                                                 onClick={() => this.onClickJobPost(jp, recruiter)}>

                                                {jp.companyImg && recruiter.profileImg ?
                                                    <img className="jp-pic"
                                                         src={`${recruiter?.profileImg}`}
                                                         alt="company logo"/> :
                                                    <img className="jp-pic" src={defaultPic} alt="company logo"/>}
                                                <h5 className="jp-title">{jp.title}</h5>
                                                <a className="jp-company" href={jp.url}
                                                   target="_blank">{jp.companyName}</a>
                                                <p className="jp-loc">{jp.location}</p>
                                            </div>)
                                        }
                                    </div>
                                </div>)

                            }

                        </div>

                        <hr className="line-separator d-md-none"></hr>



                        <div className="col-12 col-md-6 current-jp">
                            {currentJobPost &&
                            <div className="row">
                                <div className="col-12">
                                    <div className="row px-2">
                                        <div className="col-12 col-md-3 job-img-description">
                                            {currentJobPost.companyImg && currentRecruiter.profileImg ?
                                                <img className="jp-pic-current img-fluid"
                                                     src={`${currentRecruiter?.profileImg}`}
                                                     alt="company logo"/> :
                                                <img className="jp-pic img-fluid" src={defaultPic} alt="company logo"/>}

                                        </div>
                                        <div className="col-12 col-md-9 job-summary-description">
                                            <h5 className="jp-title-current">{currentJobPost.title}</h5>
                                            <a className="jp-company-current" href={currentJobPost.url}
                                               target="_blank">{currentJobPost.companyName}</a>
                                            <p className="jp-loc-current">{currentJobPost.location}</p>
                                        </div>
                                    </div>

                                    <div className="row">

                                        <div className="col-12 col-md-6 mt-3 ml-1 text-center text-md-left">
                                            {currentJobPost.url && <a href={currentJobPost.url} target="_blank">
                                                <button className="btn btn-jp-visit ">
                                                    Visit Website

                                                </button>
                                            </a>}
                                            {userType === AUTH_TYPE_JOB_SEEKER &&
                                            <button className="btn btn-jp-apply font-weight-bolder"
                                                    onClick={() => this.onApply()}>
                                                <a>Apply
                                                    <LaunchIcon
                                                        fontSize="small">
                                                    </LaunchIcon>
                                                </a>
                                            </button>}

                                        </div>
                                    </div>

                                    <hr className="line-separator"></hr>
                                    <p className="font-weight-bolder pb-2 m-0"><u>Job Description</u></p>
                                    <p className="jp-descr-current"> {currentJobPost.description}</p>

                                    <hr className="line-separator"></hr>

                                    <div className="row">
                                        <div className="col-5 jp-empl-current">
                                            <p className="font-weight-bolder m-0"><u>Employment Type</u></p>
                                            <p> {currentJobPost.employment}</p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            }
                        </div>

                        {onApply &&
                        <Dialog open={onApply}
                                onClose={this.onCloseWindow}
                                aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">
                                <p className="text-center font-weight-bold ">
                                    Apply to {currentJobPost.companyName}
                                    <button type="button" className="close" aria-label="Close"
                                            onClick={this.onCloseWindow}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </p>
                            </DialogTitle>
                            <DialogContent>
                                <Apply currentRecruiter={currentRecruiter}
                                       onSubmit={this.onCloseWindow}/>
                            </DialogContent>
                        </Dialog>
                        }

                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(JobPostsList);

