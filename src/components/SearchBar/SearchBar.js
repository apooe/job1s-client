import Autocomplete from "@material-ui/lab/Autocomplete";
import {debounce} from "lodash";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import React, {  useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import './SearchBar.css';
import {createFilterOptions} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },

    input: {
        marginLeft: theme.spacing(1),
        flex: 1,

    },
    iconButton: {
        padding: 10,
    },
}));

const filterOptions = createFilterOptions({
    limit: 8,
});

function SearchBar(props) {

    const classes = useStyles();
    const [jobs, setJobs] = useState([]);


    const onKeyUp =  (event) => {
        if (event.charCode === 13) {
            setJobs([]);
            props.search(event.target.value);
        }
    }

    const onBlur = (event) => {
        setJobs([]);
        props.search(event.target.value);
    }

    const searchJob =  (e, newValue) => {

        const url = `http://api.dataatwork.org/v1/jobs/autocomplete`;
         axios.get(url, {params: {contains: newValue}}).then(response => {
             setJobs( response?.data?.map(j => j.suggestion) || [])

        }).catch(error => {
            console.log(error?.response?.data);

        });
    }
    return (
        <Paper  className={classes.root} onKeyPress={onKeyUp}>
            <IconButton className={classes.iconButton} aria-label="menu">
                <SearchIcon />
            </IconButton>
            <Autocomplete
                id="custom-input-demo"
                fullWidth={true}
                className={classes.input}
                filterOptions={filterOptions}
                options={jobs}
                freeSolo={true}
                onBlur={onBlur}
                onInputChange={((event, value) => searchJob(event, value))}
                renderInput={(params) => (
                    <div className={'search-bar'}>
                        <TextField   placeholder="Search by title"
                                   type="text" {...params}  />
                    </div>
                )}
            />
        </Paper>


    )


}

export default SearchBar;
