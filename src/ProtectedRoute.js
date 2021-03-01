import {AuthServiceFactory} from "./services/authService";
import { Route, Redirect } from 'react-router-dom';
import React from "react";



const authService = AuthServiceFactory.getInstance();

const ProtectedRoute = ({ component: Component, requiredRole, mode, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (authService.isAuth()) {
                return <Route component={Component} {...rest} />;
            } else {
                return <Redirect to="/login" />;
            }
        }}
    />
);

export default ProtectedRoute;
