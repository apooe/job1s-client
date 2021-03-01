import {createContext} from 'react';
import {AuthServiceFactory} from "./services/authService";

export const AUTH_TYPE_RECRUITER = 'recruiter';
export const AUTH_TYPE_JOB_SEEKER = 'job_seeker';
const authService = AuthServiceFactory.getInstance();

export const defaultContextValue = {
    currentUser: authService.getCurrentUser(),
    isAuth: authService.isAuth(),
    userType: AUTH_TYPE_RECRUITER
};

export const AppContext = createContext(defaultContextValue);
