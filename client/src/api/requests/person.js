import {httpJsonRequest} from "../../utils/http";

export function registerParticipant(formData) {
    return httpJsonRequest("POST", "person", formData);
}