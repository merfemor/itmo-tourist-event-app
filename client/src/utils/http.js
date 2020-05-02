import {BACKEND_ROOT_PATH} from "./constants";
import {GlobalState} from "./global_cache";
import {addAuthorizationHeaderToParams} from "../auth/AuthStateHolder";
import {Log} from "./Log";

const TAG = "HttpRequestsLogger";

export async function httpJsonRequest(method, relativePath, bodyObject) {
    const response = await httpRequest(method, relativePath, bodyObject)
    Log.d(TAG, "For " + method + " /" + relativePath + " server returned " + response.status)
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(response.status);
}

export function httpRequest(method, relativePath, bodyObject) {
    const token = GlobalState.authToken;
    const params = {
        method: method
    };
    if (bodyObject != null) {
        params.headers = {
            'Content-Type': 'application/json'
        };
        params.body = JSON.stringify(bodyObject);
    }

    return fetch(BACKEND_ROOT_PATH + relativePath, addAuthorizationHeaderToParams(params, token));
}