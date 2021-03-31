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

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        width: 500,
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
            props.searchProfiles(event.target.value);
        }
    }

    const searchJob =  (e, newValue) => {

        const url = `http://api.dataatwork.org/v1/jobs/autocomplete`;
         axios.get(url, {params: {contains: newValue}}).then(response => {
             setJobs( response?.data || [])

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
                getOptionLabel={j => j.suggestion}
                onInputChange={((event, value) => searchJob(event, value))}
                renderInput={(params) => (
                    <div  ref={params.InputProps.ref}>
                        <InputBase  placeholder="Search by title"
                                   type="text" {...params.inputProps} />
                    </div>
                )}
            />
        </Paper>


    )


}

export default SearchBar;
