import {isNotEmpty} from "../../../utils/type_utils";
import {httpJsonRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import React from "react";

export function TaskAssigneeSuggestButton(props) {
    const getTaskData = props.data;
    const onResultCallback = props.onResult;

    function onButtonClick(e) {
        e.preventDefault()
        const taskData = getTaskData()
        const params = {};
        if (isNotEmpty(taskData.startDateTime)) {
            params.startDateTime = Date.parse(taskData.startDateTime).toString()
        }
        if (isNotEmpty(taskData.endDateTime)) {
            params.endDateTime = Date.parse(taskData.endDateTime).toString()
        }
        httpJsonRequest("GET", "task/assignee", null, params)
            .then(response => onResultCallback(response[0] || null))
    }

    return <If cond={!props.disabled}>
        <a href="#" className={props.className} onClick={onButtonClick}>{props.children}</a>
    </If>
}