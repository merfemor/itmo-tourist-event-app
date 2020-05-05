import {httpTextRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import React from "react";
import {Link} from "react-router-dom";

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
            <If cond={myId == null}>
                <Link to="/login" className="btn btn-success">Буду участвовать</Link>
            </If>
            <If cond={!isRegistered && myId != null}>
                <button className="btn btn-success" onClick={onRegisterButtonClick}>
                    Буду участвовать
                </button>
            </If>
        </div>
    )
}