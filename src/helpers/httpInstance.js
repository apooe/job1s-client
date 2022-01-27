import Axios, { AxiosInstance } from "axios";
import Qs from "qs";
import { AuthServiceFactory } from "../services/authService";

let axiosInstance = null;

const createInstance = () => {
  const authService = AuthServiceFactory.getInstance();
  const apiURL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:8080/api" ||
    "http://job1s.s3-website.eu-central-1.amazonaws.com/api";
  const instance = Axios.create({
    baseURL: apiURL, //base url for all request
    paramsSerializer: (params) =>
      Qs.stringify(params, { arrayFormat: "brackets" }),
  });

  // Interceptor: Auto add Token
  instance.interceptors.request.use(
    (config) => {
      if (authService.isAuth()) {
        const token = authService.getToken();
        if (token) {
          config.headers["Authorization"] = "Bearer " + token;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const getInstance = () => {
  if (!axiosInstance) {
    axiosInstance = createInstance();
  }

  return axiosInstance;
};

export { getInstance };
