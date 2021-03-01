import {AUTH_TYPE_JOB_SEEKER} from "../../AppContext";
import {AuthServiceFactory} from "../../services/authService";


export const MenuItems = (ctx = null) => [
    {
        title: "Profiles",
        url: "#",
        cName: "nav-links"
    },
    {
        title: "Jobs",
        url: "#",
        cName: "nav-links"
    },
    {
        title: "My profile",
        url: "/my-profile",
        cName: "nav-links"
    },
    {
        title: "Logout",
        url: "/login",
        cName: "nav-links",
        command: () => {
            AuthServiceFactory.getInstance().logOut();
            if (ctx) {
                ctx.setContext({
                    currentUser: null,
                    isAuth: false,
                    userType: null
                })
            }

        }
    },


]
