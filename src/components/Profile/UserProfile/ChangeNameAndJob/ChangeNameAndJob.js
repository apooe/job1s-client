import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import {debounce} from "lodash";
import axios from "axios";
import {getInstance} from "../../../../helpers/httpInstance";

const http = getInstance();

class ChangeNameAndJob extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: null,
            places: [],
            jobs: [],

        };
    }

    componentDidMount() {
        const {user} = this.props;
        this.setState({user});
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
        this.props.onSubmit(this.state.user);
    }

    handleUserChange = (newInfos) => {

        const oldInfos = {...this.state.user};
        const infos = {...oldInfos, ...newInfos};
        this.setState({user: infos});
    }

    render() {
        const {user} = this.state;


        if (!user) {
            return null;
        }


        return (
            <div className="container">
                <DialogTitle id="form-dialog-title">
                    <p className="text-center pb-3">Change Information</p>
                </DialogTitle>

                <form action="" onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        onChange={e => this.handleUserChange({firstname: e.target.value})}
                        className="form-control"

                        placeholder="first name"
                        value={user.firstname}
                        required
                    />

                    <input
                        type="text"
                        onChange={e => this.handleUserChange({lastname: e.target.value})}
                        className="form-control"

                        placeholder="last name"
                        value={user.lastname}
                        required
                    />

                    <input
                        type="text"
                        onChange={e => this.handleUserChange({phone: e.target.value})}
                        className="form-control"
                        placeholder="phone"
                        value={user.phone}
                        required
                    />

                    <Autocomplete
                        id="combo-box-demo"
                        className="pb-3"
                        options={this.state.jobs}
                        getOptionLabel={j => j.suggestion}
                        fullWidth
                        onInputChange={debounce((event, value) => this.searchJob(value), 300)}
                        onChange={(event, value) => this.handleUserChange({job: value.suggestion})}
                        renderInput={(params) => (
                            <TextField  {...params} label="Jobs" className="location-title"
                                        variant="outlined"/>
                        )}
                    />

                    <Autocomplete
                        id="combo-box-demo"
                        className=""
                        options={this.state.places}
                        fullWidth
                        onInputChange={(event, value) => this.loadPlaceOptions(value)}
                        onChange={(event, value) => this.handleUserChange({city: value})}
                        renderInput={(params) => (
                            <TextField  {...params} label="City"
                                        placeholder="City"
                                        variant="outlined"/>
                        )}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary mt-2 mb-4 float-right">
                        Save
                    </button>
                </form>

            </div>

        )
    }

}

export default ChangeNameAndJob;

