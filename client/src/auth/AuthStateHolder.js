import React, {createContext, useContext, useEffect, useState} from "react";
import {Log} from "../utils/Log";
import {GlobalState} from "../utils/global_cache";
import {httpJsonRequest} from "../utils/http";

const TAG = "AuthStateHolder";
const PROPERTY_TOKEN = "token";

function restoreTokenFromStorage() {
    // TODO: get token from cookies
    const token = localStorage.getItem(PROPERTY_TOKEN);
    if (token === "null") {
        return null;
    }
    return token;
}

function setTokenInStorage(token) {
    // TODO: save token in cookies
    localStorage.setItem(PROPERTY_TOKEN, token)
    console.log("token set ", token)
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

function loginWithToken(token) {
    Log.d(TAG, "loginWithToken(): start")
    return httpJsonRequest("GET", "auth")
        .then(responseJson => {
            Log.d(TAG, "loginWithToken(): success, set user info");
            return Promise.resolve({
                token: token,
                user: responseJson,
                authorizeAttemptWasDone: true
            });
        })
        .catch((status) => {
            let newToken = token
            // TODO: decide what code to send from server
            if (status === 401 || status === 403) {
                logout();
                newToken = null
            }
            return Promise.resolve({
                authorizeAttemptWasDone: true,
                token: newToken,
                user: null
            });
        })
}

function logout() {
    Log.d(TAG, "logout")
    setTokenInStorage(null)
    GlobalState.authToken = null
}

async function loginWithEmailAndPassword(formData, setAuthInfo) {
    Log.d(TAG, "loginWithEmailAndPassword: start")
    try {
        const response = await httpJsonRequest("POST", "login", formData)
        Log.d(TAG, "loginWithEmailAndPassword: server returned ok")
        if (response.token == null || response.user == null) {
            Log.w(TAG, "loginWithEmailAndPassword: user or token is null")
            return errorPromiseFromUncaughtError("token or user is null")
        }
        Log.d(TAG, "loginWithEmailAndPassword: set token and user info")
        setTokenInStorage(response.token);
        GlobalState.authToken = response.token;
        setAuthInfo({
            ...response,
            authorizeAttemptWasDone: true
        });
        return response
    } catch (err) {
        logout();
        throw err
    }
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
        loginWithToken(token)
            .then(state => {
                const newAuthInfo = {
                    ...authInfo,
                    ...state
                }
                GlobalState.authToken = newAuthInfo.token
                setAuthInfo(newAuthInfo)
            })
    }, []);

    if (authInfo.authorizeAttemptWasDone !== true) {
        // authorize in progress
        return <div/>
    }

    return <AuthContext.Provider value={{
        authInfo,
        loginWithEmailAndPassword: (formData) => loginWithEmailAndPassword(formData, setAuthInfo),
        setToken: (token) => {
            GlobalState.authToken = token
            setTokenInStorage(token)
            setAuthInfo(info => ({...info, token: token}))
        },
        setUserInfo: (userInfo) => setAuthInfo((state) => ({
            ...state,
            user: userInfo
        })),
        logout: () => {
            logout()
            setAuthInfo(state => ({
                ...state,
                token: null,
                user: null
            }))
        }
    }}>
        {props.children}
    </AuthContext.Provider>
}