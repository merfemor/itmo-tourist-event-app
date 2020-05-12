import {Redirect, Route} from "react-router-dom";
import React from "react";
import {isUserHasRoleAtLeast} from "../utils/components";
import {useAuth} from "./AuthStateHolder";
import {UserRole} from "../api/enums";

const DEFAULT_UNAUTHORIZED_REDIRECT_PATH = "/login"
const DEFAULT_AUTHORIZED_REDIRECT_PATH = "/contest"


function ConditionalRoute({condition, redirectTo, component: Component, ...rest}) {
    function render(props) {
        if (condition()) {
            return <Component {...props} />
        }
        return <Redirect to={{pathname: redirectTo, state: {from: props.location}}}/>
    }
    return <Route {...rest} render={render}/>
}

export function UnauthorizedRoute({component: Component, ...rest}) {
    const {authInfo} = useAuth();
    const redirectTo = DEFAULT_AUTHORIZED_REDIRECT_PATH
    return <ConditionalRoute condition={() => authInfo.user == null} redirectTo={redirectTo} component={Component} {...rest}/>
}

export function PrivateRoute({roleAtLeast, redirectTo, component: Component, ...rest}) {
    const {authInfo} = useAuth();
    roleAtLeast = roleAtLeast || UserRole.PARTICIPANT;
    redirectTo = redirectTo || DEFAULT_UNAUTHORIZED_REDIRECT_PATH

    return <ConditionalRoute condition={() => isUserHasRoleAtLeast(authInfo.user, roleAtLeast)} redirectTo={redirectTo} component={Component} {...rest}/>
}