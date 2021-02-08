import React, {Component} from 'react';
import {withRouter} from "react-router";
import Navbar from '../Navbar/Navbar'

import './Profile.css';

class Profile extends Component {
    render(){
        return(
            <div>
                {/*<div> nom + domain</div>*/}
                {/*<div className="details">Infos(pic + infos ==> name, status, age, location, domain, gender)*/}
                {/*    <div className="picture"></div>*/}
                {/*    <div className="infos"></div>*/}
                {/*</div>*/}
                {/*<div className="description">Description</div>*/}
                {/*<div className="education">Education</div>*/}
                {/*<div className="projects">Projects</div>*/}
                {/*<div className="contact">Contact</div>*/}
                <Navbar></Navbar>

                    <div className="resume-wrapper">
                        <section className="profile section-padding">
                            <div className="container">
                                <div className="picture-resume-wrapper">
                                    <div className="picture-resume">


                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="name-wrapper">
                                    <h1>John <br/>Anderson</h1>
                                </div>
                                <div className="clearfix"></div>
                                <div className="contact-info clearfix">
                                    <ul className="list-titles">
                                        <li>Call</li>
                                        <li>Mail</li>
                                        <li>Web</li>
                                        <li>Home</li>
                                    </ul>
                                    <ul className="list-content ">
                                        <li>+34 123 456 789</li>

                                        <li>j.anderson@gmail.com</li>


                                        <li>Los Angeles, CA</li>

                                    </ul>
                                </div>
                                <div className="contact-presentation">
                                    <p><span className="bold">Lorem</span> ipsum dolor sit amet, consectetur adipiscing
                                        elit. Vivamus euismod congue nisi, nec consequat quam. In consectetur faucibus
                                        turpis eget laoreet. Sed nec imperdiet purus. </p>
                                </div>
                                <div className="contact-social clearfix">
                                    <ul className="list-titles">
                                        <li>Twitter</li>
                                        <li>Dribbble</li>
                                        <li>Codepen</li>
                                    </ul>

                                </div>
                            </div>
                        </section>

                        <section className="experience section-padding">
                            <div className="container">
                                <h3 className="experience-title">Experience</h3>

                                <div className="experience-wrapper">
                                    <div className="company-wrapper clearfix">
                                        <div className="experience-title">Company name</div>

                                        <div className="time">Nov 2012 - Present</div>

                                    </div>

                                    <div className="job-wrapper clearfix">
                                        <div className="experience-title">Front End Developer</div>

                                        <div className="company-description">
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a elit
                                                facilisis, adipiscing leo in, dignissim
                                                magna.</p>
                                        </div>
                                    </div>

                                    <div className="company-wrapper clearfix">
                                        <div className="experience-title">Company name</div>

                                        <div className="time">Nov 2010 - Present</div>

                                    </div>

                                    <div className="job-wrapper clearfix">
                                        <div className="experience-title">Freelance, Web Designer / Web Developer</div>

                                        <div className="company-description">
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a elit
                                                facilisis, adipiscing leo in, dignissim
                                                magna.</p>
                                        </div>
                                    </div>

                                    <div className="company-wrapper clearfix">
                                        <div className="experience-title">Company name</div>

                                        <div className="time">Nov 2009 - Nov 2010</div>

                                    </div>

                                    <div className="job-wrapper clearfix">
                                        <div className="experience-title">Web Designer</div>

                                        <div className="company-description">
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a elit
                                                facilisis, adipiscing leo in, dignissim
                                                magna.</p>
                                        </div>
                                    </div>

                                </div>


                                <div className="section-wrapper clearfix">
                                    <h3 className="section-title">Skills</h3>
                                    <ul>
                                        <li className="skill-percentage">HTML / HTML5</li>
                                        <li className="skill-percentage">CSS / CSS3 / SASS / LESS</li>
                                        <li className="skill-percentage">Javascript</li>
                                        <li className="skill-percentage">Jquery</li>
                                        <li className="skill-percentage">Wordpress</li>
                                        <li className="skill-percentage">Photoshop</li>

                                    </ul>

                                </div>

                                <div className="section-wrapper clearfix">
                                    <h3 className="section-title">Hobbies</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a elit facilisis,
                                        adipiscing leo in, dignissim magna.</p>

                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a elit facilisis,
                                        adipiscing leo in, dignissim magna.</p>
                                </div>

                            </div>
                        </section>

                        <div className="clearfix"></div>
                    </div>

            </div>


        )
    }
}


export default withRouter(Profile);
