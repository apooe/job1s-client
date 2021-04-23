import React, {Component} from 'react';
import {withRouter} from "react-router";
import './Home.css';
import {getInstance} from "../../helpers/httpInstance";
import {v4 as uuid} from "uuid";
import defaultPic from '../../images/Unknown_person.jpg';
import {Link} from 'react-router-dom';
import {AppContext, AUTH_TYPE_JOB_SEEKER, AUTH_TYPE_RECRUITER} from "../../AppContext";
import axios from "axios";

const http = getInstance();

class Home extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            profiles: null,
            relatedJobs: []

        }
    }

    async componentDidMount() {
        await this.getAllUsersProfiles();
        this.props.history.listen((location) => {
            const job = new URLSearchParams(location.search).get('job');
            this.searchJob(job);
        })

    }


    searchRelatedJobs = async (job) => {
        let relatedJobsArray = this.state.relatedJobs;
        let url = 'http://api.dataatwork.org/v1/jobs/autocomplete';

        await axios.get(url, {params: {begins_with: job, ends_with: job}}).then(res => {
            const job_id = res.data[0].uuid;//we need it to search for all related jobs to this job
            url = `http://api.dataatwork.org/v1/jobs/${job_id}/related_jobs`;
            axios.get(url).then(res => {
                res.data.related_job_titles.map(job => {
                    relatedJobsArray.push(job.title);
                })
                this.setState({relatedJobs: relatedJobsArray});
                this.findCorrespondingProfiles();

            }).catch(error => {
                console.log(error?.response?.data);
            });

        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    getAllUsersProfiles = async () => {

        await this.context.context.currentUser;
        console.log("dans la premiere etape: ", this.context.context.currentUser);

        const currentUser = this.context.context.currentUser;
        if (currentUser.userType === AUTH_TYPE_JOB_SEEKER) {
            try {
                const url = '/recruiters';
                const response = await http.get(url);
                this.setState({profiles: response?.data})
            } catch (e) {
                console.log(e?.response?.data);
            }
        } else {
            await currentUser.jobPosts.map(jp => {
                this.searchRelatedJobs(jp.title);
            })
        }
    }

    searchJob = (job) => {

        const url = `/users/search/?job=${job}`;
        http.get(url).then(({data}) => {
            this.setState({profiles: data})
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    //search interesting profiles/users for the recruiter
    findCorrespondingProfiles = async () => {

        const url = `/users/findCorrespondingUsers`;
        const relatedJobs = this.state.relatedJobs;

        await http.post(url, relatedJobs).then(({data}) => {
            this.setState({profiles: data})
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }


    render() {

        const {profiles} = this.state;
        console.log(profiles);


        return (
            <div>
                <div className="container-background">
                    <h1 id="slogan">Find Your Ideal Job</h1>
                    <hr className="separator"/>
                </div>

                <div className="container profiles-users">
                    <div className="row justify-content-center">
                        {profiles?.length === 0 && <h1> We didn't find profile according to your search...</h1>}
                        {profiles?.length && profiles?.map((profile, index) =>
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
                                    <Link to={this.context.context.userType === AUTH_TYPE_RECRUITER ? `/profiles/${profile._id}` : `/recruiters/${profile._id}` }>
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
