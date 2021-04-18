import React, {Component, useState} from 'react';
import {withRouter} from "react-router";
import './Home.css';
import {getInstance} from "../../helpers/httpInstance";
import {AuthServiceFactory} from "../../services/authService";
import {v4 as uuid} from "uuid";
import defaultPic from '../../images/Unknown_person.jpg';
import {Link} from 'react-router-dom';
import {AppContext, AUTH_TYPE_JOB_SEEKER, defaultContextValue} from "../../AppContext";

const http = getInstance();

class Home extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            profiles: null,
        }
    }

    async componentDidMount() {
        await this.getAllUsersProfiles();
        this.props.history.listen((location) => {
            const job = new URLSearchParams(location.search).get('job');
            this.searchJob(job);
        })
    }

    getAllUsersProfiles = async () => {
        try {
            const url = '/users';
            const response = await http.get(url);
            this.setState({profiles: response?.data})
        } catch (e) {
            console.log(e?.response?.data);
        }
    }


    searchJob = (job) => {

        const url = `/users/search/?job=${job}`;
        http.get(url).then(({data}) => {
            console.log(data);
            this.setState({profiles: data})
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }


    render() {
        const currentUser = this.context.context.currentUser;
        const {profiles} = this.state;

        if (!currentUser)
            return null;

        return (
            <div>
                <div className="container-background">
                    <h1 id="slogan">Find Your Ideal Job</h1>
                    <hr className="separator"/>
                </div>

                <div className="container profiles-users">
                    <div className="row justify-content-center">
                        {!profiles?.length && <h1> We didn't find profile according to your search...</h1>}
                        {profiles?.length && profiles?.map((profile, index) =>
                            <div className="col-3 p-2" key={uuid()}>
                                <div className="profile-user text-center rounded p-2">
                                    {profile.picture ?
                                        <img className="pic-profile-home"
                                             src={`http://localhost:8080${profile.picture}`} alt="profile picture"/> :
                                        <img className="pic-profile-home" src={defaultPic} alt="profile picture"/>
                                    }

                                    <p className="pt-2">{profile.firstname} {profile.lastname}</p>
                                    <p>{profile.job}</p>
                                    <button type="button" className="btn btn-primary">
                                        <Link to={`/profiles/${profile._id}`}>view profile</Link></button>

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
