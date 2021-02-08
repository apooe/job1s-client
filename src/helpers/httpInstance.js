import Axios, {AxiosInstance} from 'axios';
import Qs from 'qs';
import {AuthServiceFactory} from "../services/authService";

let axiosInstance = null;

const createInstance = () => {

    const authService = AuthServiceFactory.getInstance();
    const instance = Axios.create({
        baseURL: 'http://localhost:8080/api',//base url for all request
        paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'brackets'})
    });

    // Interceptor: Auto add Token
    instance.interceptors.request.use(
        (config) => {
            if (authService.isAuth()) {
                const token = authService.getToken();
                if (token) {
                    config.headers['Authorization'] = 'Bearer ' + token;
                }
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );


    return instance;
}

const getInstance = () => {

    if (!axiosInstance) {
        axiosInstance = createInstance();
    }

    return axiosInstance;
}

export {getInstance};
