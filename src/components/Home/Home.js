import React, { Component } from "react";
import { withRouter } from "react-router";
import "./Home.css";
import { getInstance } from "../../helpers/httpInstance";
import { v4 as uuid } from "uuid";
import defaultPic from "../../images/Unknown_person.jpg";
import { Link } from "react-router-dom";
import {
  AppContext,
  AUTH_TYPE_JOB_SEEKER,
  AUTH_TYPE_RECRUITER,
} from "../../AppContext";
import Loader from "../Loader";

const http = getInstance();

class Home extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      profilesToDisplay: null,
      relatedJobs: [],
      allProfiles: null,
      user: null,
      noData: false,
    };
  }

  async componentDidMount() {
    const { currentUser, userType } = await this.context.context; //important
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("job")) {
      const job = urlParams.get("job");
      this.searchJob(job);
    } else {
      await this.getAllUsersProfiles();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location !== prevProps.location) {
      this.setState({ noData: false });

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("job")) {
        const job = urlParams.get("job");
        this.searchJob(job);
      } else {
        if (this.context.context.userType === AUTH_TYPE_RECRUITER) {
          this.findRelatedJobSeekers();
        }
      }
    }
  }

  getAllRecruiters = async () => {
    try {
      const url = "/recruiters";
      const response = await http.get(url);
      this.setState({ profilesToDisplay: response?.data });
    } catch (e) {
      console.log(e?.response?.data);
    }
  };

  recruitersMatch = async (job) => {
    try {
      const url = `/recruiters/findRelatedRecruiters/?job=${job}`;
      const response = await http.get(url);
      response?.data.length === 0
        ? await this.getAllRecruiters()
        : this.setState({ profilesToDisplay: response?.data });
    } catch (e) {
      console.log(e?.response?.data);
    }
  };

  getAllUsersProfiles = async () => {
    const { currentUser, userType } = await this.context.context;
    this.setState({ user: currentUser });
    //job seeker
    if (userType === AUTH_TYPE_JOB_SEEKER) {
      const { job } = this.state.user;
      await this.recruitersMatch(job);
    }
    //recruiter
    else {
      await this.findRelatedJobSeekers();
    }
  };

  searchJob = (job) => {
    const url =
      this.context.context.userType === AUTH_TYPE_RECRUITER
        ? `/users/search/?job=${job}`
        : `/recruiters/search/?job=${job}`;

    http
      .get(url)
      .then(({ data }) => {
        this.setState({ profilesToDisplay: data });
        if (data.length === 0) {
          this.setState({ noData: true });
        }
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
  };

  getAllJobSeekers = async () => {
    try {
      console.log("ds  get alljobseeker");
      const url = "/users";
      const response = await http.get(url);
      this.setState({ profilesToDisplay: response?.data });
    } catch (e) {
      console.log(e?.response?.data);
    }
  };

  findRelatedJobSeekers = async () => {
    const { user } = this.state;

    try {
      const url = `/recruiters/findRelatedJobSeeker/?id=${user._id}`;
      const response = await http.get(url);

      console.log(response?.data);
      response?.data.length === 0
        ? await this.getAllJobSeekers()
        : this.setState({ profilesToDisplay: response?.data });
    } catch (e) {
      console.log(e?.response?.data);
    }
  };

  render() {
    const { profilesToDisplay, noData } = this.state;
    const type = this.context.context.userType;

    if (!profilesToDisplay) {
      return <Loader />;
    }

    return (
      <div className=" home-page">
        <div className="container-background">
          <h1 id="slogan">Find Your Ideal Job</h1>
          <hr className="separator" />
        </div>

        <div className="bg-light p-3">
          <div className="container profiles-users-wrapper px-3 pb-4 shadow">
            <div className="row   justify-content-md-start">
              <h1 className="mb-5 mt-2  col-12 text-center">
                {" "}
                <span>
                  {type === AUTH_TYPE_RECRUITER ? "JOB SEEKERS" : "Recruiters"}
                </span>
              </h1>
              {noData && (
                <div className="p-3">
                  Sorry we didn't find profiles of job seekers/jobPost according
                  to your search !
                </div>
              )}

              {profilesToDisplay?.map((profile, index) => (
                <div className="border-profile shadow col-5 col-md-4 rounded profile-user my-2">
                  <div className="  " key={uuid()}>
                    {profile.picture || profile.profileImg ? (
                      <img
                        className="pic-profile-home"
                        src={`${profile.picture || profile.profileImg}`}
                        alt="profile picture"
                      />
                    ) : (
                      <img
                        className="pic-profile-home"
                        src={defaultPic}
                        alt="profile picture"
                      />
                    )}

                    <p className="font-weight-bold mb-1">
                      {profile.firstname} {profile.lastname}
                    </p>
                    <p className="job-title">{profile.job}</p>

                    <Link
                      to={
                        this.context.context.userType === AUTH_TYPE_RECRUITER
                          ? `/profiles/${profile._id}`
                          : `/recruiters/${profile._id}`
                      }
                    >
                      <button type="button" className="btn btn-primary">
                        View profile
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
