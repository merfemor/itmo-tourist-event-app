import {BACKEND_ROOT_PATH} from "./constants";
import {GlobalState} from "./global_cache";
import {addAuthorizationHeaderToParams} from "../auth/AuthStateHolder";

export async function httpJsonRequest(method, relativePath, bodyObject, urlParams) {
    const response = await httpRequest(method, relativePath, bodyObject, urlParams)
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(response.status);
}

export async function httpTextRequest(method, relativePath, bodyObject, urlParams) {
    const response = await httpRequest(method, relativePath, bodyObject, urlParams)
    if (response.ok) {
        return response.text();
    }
    return Promise.reject(response.status);
}

export async function httpBlobRequest(method, relativePath, bodyObject, urlParams) {
    const response = await httpRequest(method, relativePath, bodyObject, urlParams)
    if (response.ok) {
        return response.text();
    }
    return Promise.reject(response.status);
}

export function httpRequest(method, relativePath, bodyObject, urlParams) {
    urlParams = urlParams || {}
    const token = GlobalState.authToken;
    const params = {
        method: method
    };
    let urlParamsStr = ""
    for (let urlParam in urlParams) {
        if (urlParamsStr !== "") {
            urlParamsStr += "&"
        }
        urlParamsStr += urlParam + "=" + encodeURI(urlParams[urlParam])
    }
    if (urlParamsStr !== "") {
        relativePath += "?" + urlParamsStr
    }
    if (bodyObject != null) {
        params.headers = {
            'Content-Type': 'application/json'
        };
        params.body = JSON.stringify(bodyObject);
    }

    return fetch(BACKEND_ROOT_PATH + relativePath, addAuthorizationHeaderToParams(params, token));
}

export function saveFileOnCurrentPage(blob, filename) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
}