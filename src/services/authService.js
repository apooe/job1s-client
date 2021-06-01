import {isExpired, decodeToken} from "react-jwt";
import {getInstance} from "../helpers/httpInstance";

class AuthService {

    _tokenLabel = 'accessToken';
    _currentToken = '';
    _currentUser = null;

    constructor() {
        this._currentToken = this.getToken();
        this._currentUser = this.getCurrentUser();
    }

    getToken() {
        // Return the current token from local Storage
        return JSON.parse(localStorage.getItem(this._tokenLabel));
    }


    setToken(token) {
        // If logout we delete the token
        if (token === null) {
            localStorage.removeItem(this._tokenLabel);
            return;
        }
        // Set the current token to the local storage (in json)
        localStorage.setItem(this._tokenLabel, JSON.stringify(token));
    }


    isValidToken() {
        const token = this.getToken();
        return token && !isExpired(token);
    };

    logIn(email, password, type = null ) {
        const http = getInstance();

        const authUrl = '/users/login';

        return http.post(authUrl, {email, password}).then(response => {
            const {token} = response.data;

            // Set token
            this.setToken(token);
            this._currentToken = token;
            this._currentUser = this.getCurrentUser();

            return response;
        });
    }


    logOut() {
        this.setToken(null);
        this._currentUser = null;
        this._currentToken = null;
    }

    isAuth() {
        return this.isValidToken() && !!this._currentUser._id;
    }


    getCurrentUser() {
        const token = this.getToken();
        if (!this.isValidToken()) {
            return null;
        }
        const decodedToken = decodeToken(token);

        if (!decodedToken) {
            return null;
        }

        return decodedToken;
    }
}


export class AuthServiceFactory {
    static _instance = null;

    /**
     * Create an insatnce of auth service
     * @returns {AuthService}
     */
    static getInstance() {
        if (!AuthServiceFactory._instance) {
            AuthServiceFactory._instance = new AuthService();
        }
        return AuthServiceFactory._instance;
    }
}
