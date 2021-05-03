import React, {Component} from 'react';
import {withRouter} from "react-router";
import './Home.css';
import {getInstance} from "../../helpers/httpInstance";
import {v4 as uuid} from "uuid";
import defaultPic from '../../images/Unknown_person.jpg';
import {Link} from 'react-router-dom';
import {AppContext, AUTH_TYPE_JOB_SEEKER, AUTH_TYPE_RECRUITER} from "../../AppContext";
import axios from "axios";
import userEvent from "@testing-library/user-event";

const http = getInstance();

class Home extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            searchResults: null,
            relatedJobs: [],
            allProfiles: null,
        }
    }

    async componentDidMount() {

        const {currentUser, userType } = await this.context.context;
        console.log("user est:", currentUser,userType );

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('job')) {
            const job = urlParams.get('job');
            this.searchJob(job);
        }
        else{
            await this.getAllUsersProfiles();
        }


        // const job = new URLSearchParams(window.location.search).get('job');
        // if (job && this.context.context.userType === AUTH_TYPE_RECRUITER)
        //     this.searchJob(job);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('job')) {
                const job = urlParams.get('job');
                this.searchJob(job);
            } else {
                if(this.context.context.userType === AUTH_TYPE_RECRUITER){
                    this.getAllJobSeekers();
                }
                else{
                    //this.getAllRecruiters();

                }
            }
        }
    }

    // searchRelatedJobs = async (job) => {
    //     let relatedJobsArray = this.state.relatedJobs;
    //     let url = 'http://api.dataatwork.org/v1/jobs/autocomplete';
    //
    //     await axios.get(url, {params: {begins_with: job, ends_with: job}}).then(res => {
    //         const job_id = res.data[0].uuid;//we need it to search for all related jobs to this job
    //         url = `http://api.dataatwork.org/v1/jobs/${job_id}/related_jobs`;
    //         axios.get(url).then(res => {
    //             res.data.related_job_titles.map(job => {
    //                 relatedJobsArray.push(job.title);
    //             })
    //             this.setState({relatedJobs: relatedJobsArray});
    //             this.findCorrespondingProfiles();
    //
    //         }).catch(error => {
    //             console.log(error?.response?.data);
    //         });
    //
    //     }).catch(error => {
    //         console.log(error?.response?.data);
    //     });
    // }

    getAllRecruiters = async () => {
        try {
            const url = '/recruiters';
            const response = await http.get(url);
            this.setState({searchResults: response?.data})

        } catch (e) {
            console.log(e?.response?.data);
        }
    }

    getAllUsersProfiles = async () => {

        const {currentUser, userType } = await this.context.context;

        //job seeker
        if (userType === AUTH_TYPE_JOB_SEEKER) {
           await this.getAllRecruiters();
        }

        //recruiter
        else {
            //le recruiter n'a aucun jobpost
            if (currentUser && currentUser.jobPosts?.length === 0) {
                await this.getAllJobSeekers();
            }

            else { //pour le match plus tard
                await this.getAllJobSeekers();
                // await currentUser.jobPosts.map(jp => {
                //     this.searchRelatedJobs(jp.title);
                // })
            }

        }
    }

    searchJob = (job) => {

        const url = this.context.context.userType === AUTH_TYPE_RECRUITER ?
            `/users/search/?job=${job}` : `/recruiters/search/?job=${job}`;

        http.get(url).then(({data}) => {
            this.setState({searchResults: data})
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    // //search interesting profiles/users for the recruiter
    // findCorrespondingProfiles = async () => {
    //
    //     const url = `/users/findCorrespondingUsers`;
    //     const relatedJobs = this.state.relatedJobs;
    //
    //     await http.post(url, relatedJobs).then(({data}) => {
    //         this.setState({searchResults: data})
    //         console.log("find corresponding profiles", data);
    //
    //         if (data.length === 0) {
    //             this.getAllJobSeekers();
    //         }
    //
    //     }).catch(error => {
    //         console.log(error?.response?.data);
    //     });
    // }

    getAllJobSeekers = async () => {

        try {
            const url = '/users';
            const response = await http.get(url);
            this.setState({searchResults: response?.data});

        } catch (e) {
            console.log(e?.response?.data);
        }
    }


    render() {

        const {searchResults} = this.state;
        const type = this.context.context.userType;


        return (
            <div>
                <div className="container-background">
                    <h1 id="slogan">Find Your Ideal Job</h1>
                    <hr className="separator"/>
                </div>


                <div className="container profiles-users">
                    {type === AUTH_TYPE_RECRUITER ? <h2 className="mb-5">Job Seekers</h2> : <h2>Recruiters</h2>}
                    <div className="row justify-content-center">

                        {searchResults?.length === 0 && <h5> We didn't find profiles...</h5>}
                        {searchResults?.length && searchResults?.map((profile, index) =>
                            <div className="col-3 p-2" key={uuid()}>
                                <div className="profile-user text-center rounded p-2">
                                    {profile.picture ?
                                        <img className="pic-profile-home"
                                             src={`${process.env.REACT_APP_API_BASE_URL}${profile.picture}`}
                                             alt="profile picture"/> :
                                        <img className="pic-profile-home" src={defaultPic} alt="profile picture"/>
                                    }

                                    <p className="py-1 font-weight-bold">{profile.firstname} {profile.lastname}</p>
                                    <p className="pb-1">{profile.job}</p>
                                    <Link
                                        to={this.context.context.userType === AUTH_TYPE_RECRUITER ? `/profiles/${profile._id}` : `/recruiters/${profile._id}`}>
                                        <button type="button" className="btn btn-primary">
                                            View profile
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        )
    }
}


export default withRouter(Home);
