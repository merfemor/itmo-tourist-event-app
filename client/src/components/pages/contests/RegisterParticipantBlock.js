import React, {useState} from "react";
import {httpTextRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import PersonSearchDropdownInput from "../../forms/PersonSearchDropdownInput";


export function RegisterParticipantBlock(props) {
    const contestId = props.contestId;
    const onRegistrationSuccessCallback = props.onRegistrationSuccessCallback;
    const [selectedId, setSelectedId] = useState(null)

    const dropdownCallbacks = {}

    function onAddButtonClick() {
        httpTextRequest("POST", `contest/${contestId}/registration`, {
            participantId: selectedId
        }).then(() => {
            setSelectedId(null)
            dropdownCallbacks.clearQuery()
            onRegistrationSuccessCallback()
        })
    }

    return (
        <If roleAtLeast={UserRole.VOLUNTEER}>
            <div className="input-group">
                <PersonSearchDropdownInput onChange={it => setSelectedId(it?.id)}
                                           registerCallbacks={dropdownCallbacks}
                                           placeholderText="Добавить участника"/>
                <div className="input-group-btn">
                    <button className="btn btn-success" onClick={onAddButtonClick} disabled={selectedId == null}>
                        <i className="fa fa-plus"/><span className="d-sm-down-none"> Добавить</span>
                    </button>
                </div>
            </div>
        </If>
    )
}