import {Redirect, Route} from "react-router-dom";
import React from "react";
import {useAuth} from "./AuthStateHolder";

export default function PrivateRoute(props) {
    const { authInfo } = useAuth();
    return (
        <Route> { authInfo.user ? props.children : <Redirect to="/"/> } </Route>
    );
}