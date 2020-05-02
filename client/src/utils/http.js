import {BACKEND_ROOT_PATH} from "./constants";
import {GlobalState} from "./global_cache";
import {addAuthorizationHeaderToParams} from "../auth/AuthStateHolder";

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