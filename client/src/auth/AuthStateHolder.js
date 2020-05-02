import React, {createContext, useContext, useEffect, useState} from "react";
import {Log} from "../utils/Log";
import {GlobalState} from "../utils/global_cache";
import {httpRequest} from "../utils/http";

const TAG = "AuthStateHolder";

function restoreTokenFromStorage() {
    // TODO: get token from cookies
    const token = localStorage.getItem("token");
    if (token === "null") {
        return null;
    }
    return token;
}

function setTokenInStorage(token) {
    // TODO: save token in cookies
    localStorage.setItem("token", token)
    GlobalState.authToken = token
}

export function addAuthorizationHeaderToParams(params, token) {
    if (params.headers == null) {
        params.headers = {}
    }
    if (params.headers['Authorization']) {
        throw new Error("Authorization header already set")
    }
    if (token != null) {
        params.headers['Authorization'] = 'Bearer ' + token
    }
    return params
}

function errorPromiseFromResponse(response) {
    return Promise.reject({
        status: response.status,
        isNotAuthorized: response.status === 401
    })
}

function errorPromiseFromUncaughtError(e) {
    return Promise.reject({
        error: e
    })
}

function loginWithToken(token, setAuthInfo) {
    Log.d(TAG, "loginWithToken(): start")
    httpRequest("GET", "auth")
        .then(response => {
            if (response.status === 401) {
                Log.d(TAG, "loginWithToken(): bad or expired token, clear in storage and logout");
                logout();
                return errorPromiseFromResponse(response);
            } else if (response.status !== 200) {
                return errorPromiseFromResponse(response);
            }
            return response.json()
        }).then(response => {
        Log.d(TAG, "loginWithToken(): success, set user info");
        setAuthInfo(state => {
            return {
                ...state,
                token: token,
                user: response,
                authorizeAttemptWasDone: true
            }
        });
        return Promise.resolve(response);
    })
}

function logout(setAuthInfo) {
    Log.d(TAG, "logout")
    setTokenInStorage(null)
    setAuthInfo((state) => {
        return {
            ...state,
            token: null,
            user: null
        }
    })
}

function loginWithEmailAndPassword(formData, setAuthInfo) {
    Log.d(TAG, "loginWithEmailAndPassword: start")
    return httpRequest("POST", "login", formData)
        .then(response => {
            if (response.ok) {
                Log.d(TAG, "loginWithEmailAndPassword: server returned ok")
                return response.json()
            }
            logout()
            return errorPromiseFromResponse(response)

        }).then(response => {
            if (response.token == null || response.user == null) {
                Log.w(TAG, "loginWithEmailAndPassword: user or token is null")
                return errorPromiseFromUncaughtError("token or user is null")
            }
            Log.d(TAG, "loginWithEmailAndPassword: set token and user info")
            setTokenInStorage(response.token);
            setAuthInfo({
                ...response,
                authorizeAttemptWasDone: true
            });
            return Promise.resolve(response)
        })
}

export const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthStateHolder(props) {
    const [authInfo, setAuthInfo] = useState({
        authorizeAttemptWasDone: false,
        token: null,
        user: null
    });

    useEffect(() => {
        const token = restoreTokenFromStorage();
        GlobalState.authToken = token;
        if (token == null) {
            Log.d(TAG, "Restore session finished, token is null, nothing to do");
            setAuthInfo((state) => {
                return {
                    ...state,
                    authorizeAttemptWasDone: true
                }
            })
            return
        }
        loginWithToken(token, setAuthInfo)
    }, []);

    if (authInfo.authorizeAttemptWasDone !== true) {
        // authorize in progress
        return <div/>
    }

    return <AuthContext.Provider value={{
        authInfo,
        loginWithEmailAndPassword: (formData) => loginWithEmailAndPassword(formData, setAuthInfo),
        setUserInfo: (userInfo) => setAuthInfo((state) => {
            return {
                ...state,
                user: userInfo
            }
        }),
        logout: () => logout(setAuthInfo)
    }}>
        {props.children}
    </AuthContext.Provider>
}