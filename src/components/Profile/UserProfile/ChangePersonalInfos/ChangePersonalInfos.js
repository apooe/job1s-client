import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddIcon from '@material-ui/icons/Add';
import {IconButton, TextField} from "@material-ui/core";
import {debounce} from "lodash";
import axios from "axios";
import {getInstance} from "../../../../helpers/httpInstance";
import "./ChangePersonalInfos.css"
import {v4 as uuid} from "uuid";
import LinkIcon from '@material-ui/icons/Link';
import DeleteIcon from '@material-ui/icons/Delete';

const http = getInstance();

class ChangePersonalInfos extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: null,
            places: [],
            jobs: [],
            onAddWebsite: false,
            websites: [],
            url: null

        };
    }

    componentDidMount() {
        const {user} = this.props;
        this.setState({user});
        this.setState({websites: user.websites});

    }

    loadPlaceOptions = async (newValue) => {

        const url = '/place';
        await http.get(url, {params: {city: newValue}}).then(response => {
            this.setState({places: response?.data || []})

        }).catch(error => {
            console.log(error?.response?.data);

        });
    }

    searchJob = async (newValue) => {

        const url = `http://api.dataatwork.org/v1/jobs/autocomplete`;
        await axios.get(url, {params: {contains: newValue}}).then(response => {
            this.setState({jobs: response?.data || []})

        }).catch(error => {
            console.log(error?.response?.data);

        });
    }

    onSubmit = (e) => {

        e.preventDefault();
        this.props.onEdit(this.state.user);
    }

    handleUserChange = (newInfos) => {

        const oldInfos = {...this.state.user};
        const infos = {...oldInfos, ...newInfos};
        this.setState({user: infos});

    }

    onAddWebsite = () => {

        this.setState({onAddWebsite: true})
    }

    AddWebsite = async () => {

        const arrayUrls = this.state.websites;
        if(this.state.url) {
            await arrayUrls.push(this.state.url);
            await this.handleUserChange( {...this.state.websites});
        }
        await this.closeAddWebsite();

    }

    closeAddWebsite = async () => {
        await this.setState({onAddWebsite: false})

    }

    handleAddWebsite = async (newUrl) => {
        await this.setState({url: newUrl});
    }

    onDeleteWebsite = async (url) => {

        const arrayUrls = this.state.websites;
        const index = arrayUrls.indexOf(url);
        if (index > -1) {
            await arrayUrls.splice(index, 1);
        }
        const websites = {...this.state.websites};
        this.handleUserChange(websites);
    }


    render() {
        const {user, onAddWebsite, websites} = this.state;

        if (!user) {
            return null;
        }


        return (
            <div className="container">
                <DialogTitle id="form-dialog-title">
                    <p className="text-center pb-3">Change Information</p>
                </DialogTitle>

                <form action="" onSubmit={this.onSubmit}>
                    <label className="label-contact">First name</label>
                    <input
                        type="text"
                        onChange={e => this.handleUserChange({firstname: e.target.value})}
                        className="form-control"
                        placeholder="first name"
                        value={user.firstname}
                        required
                    />
                    <label className="label-contact">Last name</label>
                    <input
                        type="text"
                        onChange={e => this.handleUserChange({lastname: e.target.value})}
                        className="form-control"
                        placeholder="last name"
                        value={user.lastname}
                        required
                    />

                    <label className="label-contact">Email</label>
                    <input
                        type="email"
                        onChange={e => this.handleUserChange({email: e.target.value})}
                        className="form-control"
                        placeholder="Email"
                        value={user.email}
                    />
                    <label className="label-contact">Phone number</label>
                    <input
                        type="text"
                        onChange={e => this.handleUserChange({phone: e.target.value})}
                        className="form-control"
                        placeholder="phone"
                        value={user.phone}
                    />

                    <label className="label-contact">Address</label>
                    <input
                        type="text"
                        onChange={e => this.handleUserChange({address: e.target.value})}
                        className="form-control"
                        placeholder="Address"
                        value={user.address}

                    />
                    <label className="label-contact">Job</label>
                    <Autocomplete
                        id="combo-box-demo"
                        className="location-autocomplete"
                        options={this.state.jobs}
                        getOptionLabel={option => option.suggestion || option}
                        fullWidth
                        freeSolo
                        value={user.job}
                        onInputChange={debounce((event, value) => this.searchJob(value), 300)}
                        onChange={(e, value) => this.handleUserChange({job: value?.suggestion})}
                        renderInput={(params) => (
                            <TextField  {...params} className="location-title"
                                        variant="outlined" />
                        )}

                    />


                    <label className="label-contact">City</label>
                    <Autocomplete
                        id="combo-box-demo"
                        className="location-autocomplete"
                        options={this.state.places}
                        fullWidth
                        freeSolo
                        value={user.city}
                        onInputChange={(event, value) => this.loadPlaceOptions(value)}
                        onChange={(event, value) => this.handleUserChange({city: value})}
                        renderInput={(params) => (
                            <TextField  {...params} className="location-title"
                                        variant="outlined"/>
                        )}

                    />


                    <h5>Websites</h5>
                    {websites && websites.map((url) => {
                        return (
                            <div key={uuid()} className="py-1">
                                <LinkIcon color="primary" fontSize="small"/><a className="ml-1"
                                                                              href={`${url}`}>{url}</a>
                                <IconButton className="ml-3 "  onClick={() => this.onDeleteWebsite(url)}>
                                    <DeleteIcon  fontSize="small" color="action"
                                    />
                                </IconButton>

                            </div>
                        )
                    })}
                    <a href="#" className="p-0 mt-2 d-flex"
                            onClick={this.onAddWebsite}><AddIcon color="primary"/> Add website
                    </a>


                    {onAddWebsite && <input
                        type="text"
                        onChange={e => this.handleAddWebsite(e.target.value)}
                        className="form-control mt-3"
                        placeholder="url"
                    />}

                    <button
                        type="submit"
                        onClick={()=> this.AddWebsite()}
                        className="btn btn-primary  save-change-btn ">
                        Save
                    </button>

                </form>


                {/*<Dialog open={onAddWebsite}*/}
                {/*        onClose={this.closeAddWebsite}*/}
                {/*        aria-labelledby="form-dialog-title">*/}
                {/*    <DialogContent>*/}
                {/*        <button type="button" className="close" aria-label="Close"*/}
                {/*                onClick={this.closeAddWebsite}>*/}
                {/*            <span aria-hidden="true">&times;</span>*/}
                {/*        </button>*/}


                {/*        {websites && websites.map((url) => {*/}

                {/*            return (*/}
                {/*                <div key={uuid()} className="pb-3">*/}
                {/*                    <LinkIcon color="action" fontSize="small"/><a className="ml-1"*/}
                {/*                                                                  href={`${url}`}>{url}</a>*/}
                {/*                    <DeleteIcon className="ml-3" fontSize="small" color="action"*/}
                {/*                                onClick={() => this.onDeleteWebsite(url)}/>*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })}*/}

                {/*        <p><strong><AddIcon*/}
                {/*        onClick={this.onAddWebsite}/>Add website</strong></p>*/}

                {/*        <input*/}
                {/*            type="text"*/}
                {/*            onChange={e => this.handleAddWebsite(e.target.value)}*/}
                {/*            className="form-control"*/}
                {/*            placeholder="url"*/}
                {/*        />*/}

                {/*        <button*/}
                {/*            type="button"*/}
                {/*            className="btn btn-primary mt-2 mb-4 float-right"*/}
                {/*            onClick={() => this.AddWebsite()}>*/}
                {/*            Save*/}
                {/*        </button>*/}

                {/*    </DialogContent>*/}
                {/*</Dialog>*/}

            </div>

        )
    }

}

export default ChangePersonalInfos;

