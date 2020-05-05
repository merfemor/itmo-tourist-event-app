import {httpTextRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import React from "react";

export function RegisterMeButton(props) {
    const data = props.data;
    const createSuccessCallback = props.createSuccessCallback;
    const deleteSuccessCallback = props.deleteSuccessCallback;
    const contestId = props.contestId;
    const myId = props.myId;
    const isRegistered = data.find(it => it.participantId === myId) != null;

    function onRegisterButtonClick() {
        httpTextRequest("POST", `contest/${contestId}/registration`, {
            participantId: myId
        }).then(() => createSuccessCallback(myId))
    }

    function onDeleteRegisterButtonClick(e) {
        e.preventDefault()
        httpTextRequest("DELETE", `contest/${contestId}/registration/single/${myId}`)
            .then(() => deleteSuccessCallback(myId))
    }

    return (
        <div className={props.className}>
            <If cond={isRegistered}>
                <button className="btn btn-danger" onClick={onDeleteRegisterButtonClick}>
                    Не буду участвовать
                </button>
            </If>
            <If cond={!isRegistered}>
                <button className="btn btn-success" onClick={onRegisterButtonClick}>
                    Зарегистрировать себя
                </button>
            </If>
        </div>
    )
}