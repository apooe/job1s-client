import React, {useContext} from 'react';
import "../Login/LoginManager.css";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import {useHistory, withRouter} from "react-router"
import Button from '@material-ui/core/Button';
import {Avatar, Grid, Paper} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {AppContext, AUTH_TYPE_JOB_SEEKER, AUTH_TYPE_RECRUITER} from "../../AppContext";

export default function SetUserRole() {

    const {context, setContext} = useContext(AppContext);
    const history = useHistory();

    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('');

    const handleRadioChange = (event) => {
        setValue(event.target.value);
        setHelperText('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (value === 'job seeker') {
            setContext({userType: AUTH_TYPE_JOB_SEEKER})
            history.push('/register');
        } else if (value === 'recruiter') {
            setContext({userType: AUTH_TYPE_RECRUITER})
            history.push('/register');
        } else {
            setError(true);
            setHelperText('Please select an option.');
        }
    };

    return (

        <div className="form-container">

            <Grid>
                <Paper elevation={10} id="paper-status">
                    <Grid align="center">
                        <Avatar id="avatar"><LockOutlinedIcon/></Avatar>
                        <h2>register </h2>
                        <h5 className="mb-1">I am a...</h5>
                        {error && <FormHelperText className="text-center helper-text">{helperText}</FormHelperText>}


                    </Grid>
                    <form onSubmit={handleSubmit} className="">

                        <FormControl component="fieldset">


                            <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
                                <FormControlLabel value="job seeker" control={<Radio/>} label="Job seeker"/>
                                <FormControlLabel value="recruiter" control={<Radio/>} label="Recruiter"/>
                            </RadioGroup>


                            <Button className="btn-setRole" type="submit"  variant="contained"
                                    color="primary">
                                Next
                            </Button>


                        </FormControl>
                    </form>
                </Paper>
            </Grid>
        </div>
    );
}


