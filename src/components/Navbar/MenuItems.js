import { AUTH_TYPE_JOB_SEEKER } from "../../AppContext";
import { AuthServiceFactory } from "../../services/authService";
const menuItemsJobSeeker = (ctx) => [
  {
    title: "Jobs",
    url: "/jobs",
    cName: "nav-links",
  },
  {
    title: "My profile",
    url: "/my-profile",
    cName: "nav-links",
  },
  {
    title: "Logout",
    url: "/",
    cName: "nav-links",
    command: () => {
      AuthServiceFactory.getInstance().logOut();
      if (ctx) {
        ctx.setContext({
          currentUser: null,
          isAuth: false,
          userType: null,
        });
      }
    },
  },
];

const menuItemRecruiter = (ctx) => [
  {
    title: "Profiles",
    url: "/home",
    cName: "nav-links",
  },
  ...menuItemsJobSeeker(ctx),
];

export const MenuItems = (ctx = null) => {
  return ctx?.context?.userType === AUTH_TYPE_JOB_SEEKER
    ? menuItemsJobSeeker(ctx)
    : menuItemRecruiter(ctx);
};
