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
        };

    }

    componentDidMount() {
        this.getRecruitersJobPosts();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            console.log("URL CHANGED", this.state);
            this.getRecruitersJobPosts();
        }
    }

    getRecruitersJobPosts = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('job')) {
            this.getJobParam();
        } else {
            this.getAllRecruiters();
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

            console.log("ds getjobpost selon la recherche  = ", jobSearch, " et recruiters recus: ", data);

            this.handleChangeRecruiters(data);
            const recruiters = this.state.recruiters;

            if (recruiters.length !== 0) {
                const firstJp = recruiters[0]?.jobPosts[0];
                this.setState({currentJobPost: firstJp, currentRecruiter: recruiters[0]});
            } else {
                this.setState({currentJobPost: null, currentRecruiter: null});
            }

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    handleChangeRecruiters = async (newRecruiters) => {

        //const oldArrayRecruiters = this.state.recruiters;
        //const newArrayRecruiters = [oldArrayRecruiters, ...newRecruiters];
        await this.setState({recruiters: newRecruiters});
    }

    // getJobsTitle = async (searchJob) => {
    //
    //     const allJobs = await this.jobAutocomplete(searchJob); //autocomplete give all titles jobs
    //     allJobs.map(j => { //related jobs of all jobs
    //         this.getRelatedJobsTitle(j);
    //     })
    //
    //     const relatedJob = this.state.relatedJobs;
    //
    //     if(relatedJob) {
    //         await this.setState({recruiters: []});
    //         console.log("related jobs = ",relatedJob);
    //
    //         await this.searchJobPosts(searchJob); //find according jobposts
    //
    //
    //
    //         // relatedJob.map( j =>{
    //         //     this.searchJobPosts(j); //find according jobposts
    //         //
    //         // })
    //     }
    // }

    // searchJobPosts = async (job) => {
    //
    //     const url = `/recruiters/search/?job=${job}`;
    //     await http.get(url).then(({data}) => {
    //
    //         console.log("dedans job = ", job, " et recruiters: ", data);
    //         this.handleChangeRecruiters(data);
    //         const recruiters = this.state.recruiters;
    //
    //         if (recruiters.length !== 0) {
    //             const firstJp = recruiters[0]?.jobPosts[0];
    //             this.setState({currentJobPost: firstJp, currentRecruiter: recruiters[0]});
    //         } else {
    //             this.setState({currentJobPost: null, currentRecruiter: null});
    //         }
    //
    //     }).catch(error => {
    //         console.log(error?.response?.data);
    //     });
    // }




    // getRelatedJobsTitle = async (job) => {
    //
    //     let relatedJobsTitles = [];
    //     const url = `http://api.dataatwork.org/v1/jobs/${job}/related_jobs`;
    //
    //     await axios.get(url).then(response => {
    //         response?.data.related_job_titles.map(j => {
    //             relatedJobsTitles.push(j.title);
    //         })
    //         this.changeRelatedJobs(relatedJobsTitles);
    //
    //     }).catch(error => {
    //         console.log(error?.response?.data);
    //     });
    // }

    // changeRelatedJobs = async (newValue) => {
    //     const oldArrayJobs = this.state.relatedJobs;
    //     const newArrayJobs = [...oldArrayJobs, ...newValue];
    //     await this.setState({relatedJobs: newArrayJobs});
    // }


    // jobAutocomplete = async (search) => {
    //
    //     let allJobs = []; //array of jobs uuid that contains 'job' title
    //     const url = `http://api.dataatwork.org/v1/jobs/autocomplete`;
    //     await axios.get(url, {params: {contains: search}}).then(response => {
    //         allJobs = response?.data?.map(j => j.uuid) || [];
    //
    //     }).catch(error => {
    //         console.log(error?.response?.data);
    //
    //     });
    //     return allJobs;
    // }


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

            <div>
                <div className="container">
                    {recruiters.length === 0 && <div>there is no job Post</div>}

                    <div className="row  flex-row-reverse flex-md-row">

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


                        <div className="col-12 col-md-6 current-jp">
                            {currentJobPost &&
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-3">
                                            {currentJobPost.companyImg && currentRecruiter.profileImg ?
                                                <img className="jp-pic-current"
                                                     src={`${currentRecruiter?.profileImg}`}
                                                     alt="company logo"/> :
                                                <img className="jp-pic" src={defaultPic} alt="company logo"/>}

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
                                            {currentJobPost.url && <a href={currentJobPost.url} target="_blank"><button  className="btn btn-jp-visit ">
                                                Visit Website

                                            </button> </a>}
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

