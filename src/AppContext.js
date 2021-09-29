import { createContext } from "react";
import { AuthServiceFactory } from "./services/authService";

export const AUTH_TYPE_RECRUITER = "recruiter";
export const AUTH_TYPE_JOB_SEEKER = "job_seeker";

const authService = AuthServiceFactory.getInstance();
const defaultCurrentUser = authService.getCurrentUser();

export const defaultContextValue = {
  currentUser: defaultCurrentUser,
  isAuth: authService.isAuth(),
  userType: defaultCurrentUser?.userType,
  menu: [],
};

export const AppContext = createContext(defaultContextValue);
