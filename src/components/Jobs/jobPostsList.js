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
import {AppContext, AUTH_TYPE_JOB_SEEKER, defaultContextValue} from "../../AppContext";

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
            onSearch: false
        };

    }

    componentDidMount() {
        this.getRecruitersJobPosts();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            console.log("URL CHANGED");
            this.getRecruitersJobPosts();
        }
    }

    getRecruitersJobPosts = () =>{
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('job')) {
            this.getJobParam();
        } else {
            this.getAllRecruiters();
        }

    }



    getJobParam = async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const job = urlParams.get('job');
        this.searchJobPosts(job);

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

    searchJobPosts = async (job) => {

        const url = `/recruiters/search/?job=${job}`;
        await http.get(url).then(({data}) => {
            this.setState({recruiters: data});
            if (data.length !== 0) {
                const firstJp = this.state.recruiters[0]?.jobPosts[0];
                this.setState({currentJobPost: firstJp, currentRecruiter: this.state.recruiters[0]});
            }
            else{
                this.setState({currentJobPost: null, currentRecruiter: null});
            }

        }).catch(error => {
            console.log(error?.response?.data);
        });


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
        const imgSource = currentJobPost && currentJobPost.companyImg ? defaultPic : defaultPic; //pb a checker

        return (

            <div>
                <div className="container">
                    <div className="row">
                        {currentRecruiter ?
                            <div className="col-5 jobPost-list">
                            {recruiters.map((recruiter, index) =>
                                <div key={uuid()} className="row">
                                    <div className="col-12 ">

                                        {recruiter.jobPosts && recruiter.jobPosts.map((jp) =>
                                            <div key={uuid()} className="one-jp border pl-3"
                                                 onClick={() => this.onClickJobPost(jp, recruiter)}>

                                                {jp.companyImg ?
                                                    <img className="jp-pic"
                                                         src={`${process.env.REACT_APP_API_BASE_URL}${recruiter?.profileImg}`}
                                                         alt="company logo"/> :
                                                    <img className="jp-pic" src={imgSource} alt="company logo"/>}
                                                <h5 className="jp-title">{jp.title}</h5>
                                                <a className="jp-company" href={jp.url}
                                                   target="_blank">{jp.companyName}</a>
                                                <p className="jp-loc">{jp.location}</p>


                                            </div>)
                                        }
                                    </div>
                                </div>)

                            }

                        </div> : <div>No job posts to display !</div>

                        }


                        <div className="col-6 current-jp">
                            {currentJobPost &&
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-3">
                                            {currentJobPost.companyImg ?
                                                <img className="jp-pic-current"
                                                     src={`${process.env.REACT_APP_API_BASE_URL}${currentRecruiter?.profileImg}`}
                                                     alt="company logo"/> :
                                                <img className="jp-pic" src={imgSource} alt="company logo"/>}

                                        </div>
                                        <div className="col-9">
                                            <h5 className="jp-title-current">{currentJobPost.title}</h5>
                                            <a className="jp-company-current" href={currentJobPost.url}
                                               target="_blank">{currentJobPost.companyName}</a>
                                            <p className="jp-loc-current">{currentJobPost.location}</p>
                                        </div>
                                    </div>

                                    <div className="row">

                                        <div className="col-6 mt-3 ml-1">
                                            <button className="btn btn-jp-visit ">
                                                <a href={currentJobPost.url} target="_blank">Visit Website
                                                </a>
                                            </button>
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
                                        {/*<div className="col-6">*/}
                                        {/*    <p className="font-weight-bolder m-0"><u>Industry</u></p>*/}
                                        {/*    <p className="">{currentJobPost.job}</p>*/}
                                        {/*</div>*/}

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

