import {Redirect, Route} from "react-router-dom";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const ProtectedCondRoute = ({ componentTrue, componentFalse, condition, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
                return <ProtectedRoute component={condition ? componentTrue : componentFalse} {...rest} />;

        }}
    />
);

export default ProtectedCondRoute;
