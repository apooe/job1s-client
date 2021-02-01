import Axios, {AxiosInstance} from 'axios';
import Qs from 'qs';

let axiosInstance = null;

const createInstance = () =>{

    const instance = Axios.create({
        baseURL:'http://localhost:8080/api',//base url for all request
        paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'brackets'})
    });

    return instance;
}

const getInstance = () =>{

    if(!axiosInstance){
        axiosInstance = createInstance();
    }

    return axiosInstance;
}

export {getInstance};
