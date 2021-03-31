import React, {Component, useState} from 'react';
import {withRouter} from "react-router";
import './Home.css';
import {getInstance} from "../../helpers/httpInstance";
import {AuthServiceFactory} from "../../services/authService";
import {v4 as uuid} from "uuid";
import defaultPic from '../../images/Unknown_person.jpg';
import {Link} from 'react-router-dom';
import {AUTH_TYPE_JOB_SEEKER, defaultContextValue} from "../../AppContext";

const http = getInstance();
const context = defaultContextValue;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            currentUser: null,

        }
    }

    async componentDidMount() {

        const user = AuthServiceFactory.getInstance().getCurrentUser();
        const url = context.userType === AUTH_TYPE_JOB_SEEKER ? `/users/${user._id}` : `/recruiters/${user._id}`;
        await this.getProfilesAndCurrentUser(url, this.state.currentUser);

        await this.onSearchProfiles();


    }

    onSearchProfiles = async () => {

        await this.getProfilesAndCurrentUser(`/users`, this.state.currentUser);
        const {history} = this.props;
        history.listen((location) => {
            const job = new URLSearchParams(location.search).get('job');
            this.searchAction(job);
        })
    }

    getProfilesAndCurrentUser = async (url, currentUser) => {

        await http.get(url).then(({data}) => {
            !currentUser ? this.setState({currentUser: data}) : this.setState({profiles: data});
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }

    searchAction = (job) => {

        const url = `/users/search/?job=${job}`;
        http.get(url).then(({data}) => {
            console.log(data);
            this.setState({profiles: data})
        }).catch(error => {
            console.log(error?.response?.data);
        });
    }


    render() {


        const {profiles, currentUser} = this.state;
        if (!profiles || !currentUser)
            return null;

        return (
            <div>
                <div className="container-background">
                    <h1 id="slogan">Find Your Ideal Job</h1>
                    <hr className="separator"/>
                </div>

                <div className="container profiles-users">
                    <div className="row justify-content-center">
                        {profiles.length === 0 && <h1> We didn't find profile according to your search...</h1>}
                        {profiles.map((profile, index) =>
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
