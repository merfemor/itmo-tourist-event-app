import {BACKEND_ROOT_PATH} from "../utils/constants";
import {GlobalState} from "../utils/global_cache";
import {addAuthorizationHeaderToParams} from "../auth/AuthStateHolder";

export function httpRequest(method, relativePath, bodyObject) {
    const token = GlobalState.authToken;
    const params = {
        method: method
    };
    console.log(token)
    if (bodyObject != null) {
        params.headers = {
            'Content-Type': 'application/json'
        };
        params.body = JSON.stringify(bodyObject);
    }

    return fetch(BACKEND_ROOT_PATH + relativePath, addAuthorizationHeaderToParams(params, token));
}