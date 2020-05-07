import React, {useState} from "react";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {personFullName, resultToString} from "../../../utils/language_utils";
import {EditContestResultModal} from "./CreateResultModal";
import {httpTextRequest} from "../../../utils/http";

export function ContestSingleParticipantResultsTable(props) {
    const data = props.data
    const onChangeCallback = props.onChange

    const [isResultCreateModalOpen, setResultCreateModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState(null)

    function updateResult(registration, newResult) {
        const contestId = registration.contestId
        const participantId = registration.participantId
        const newRegistration = {
            ...registration,
            result: newResult
        }
        httpTextRequest("PUT", `contest/${contestId}/registration/single/${participantId}`, newRegistration)
            .then(() => {
                onChangeCallback()
                setResultCreateModalOpen(false)
            })
    }

    function onEditResultButtonClick(registration) {
        setEditingRegistration(registration)
        setResultCreateModalOpen(true)
    }

    function onResultDeleteButtonClick() {
        updateResult(editingRegistration, null)
    }

    function onCreateResultButtonClick(registration) {
        setEditingRegistration(registration)
        setResultCreateModalOpen(true)
    }

    function onResultEditCancel(result) {
        setEditingRegistration(null)
        setResultCreateModalOpen(false)
    }

    function onResultSubmit(result) {
        updateResult(editingRegistration, result)
    }

    return <div>
        <table className="table-outline table table-hover table-sm mb-1">
            <thead className="thead-default">
            <tr>
                <th className="text-center">№</th>
                <th>ФИО</th>
                <th>Результат</th>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <th/>
                </If>
            </tr>
            </thead>
            <tbody>
            {data.map(it =>
                <tr key={it.participant.id}>
                    <th className="text-center">{it.participant.id}</th>
                    <th>
                        {personFullName(it.participant)}
                    </th>
                    <th>
                        {resultToString(it.result)}
                    </th>
                    <If roleAtLeast={UserRole.VOLUNTEER}>
                        <th className="text-right pr-2">
                            <If cond={it.result != null}>
                                <button className="btn btn-link btn-sm" onClick={() => onEditResultButtonClick(it)}>
                                    <i className="fa fa-pencil"/><span className="d-sm-down-none"> Редактировать</span>
                                </button>
                            </If>
                            <If cond={it.result == null}>
                                <button className="btn btn-link text-success btn-sm" onClick={() => onCreateResultButtonClick(it)}>
                                    <i className="fa fa-plus"/><span className="d-sm-down-none"> Внести</span>
                                </button>
                            </If>
                        </th>
                    </If>
                </tr>
            )}
            </tbody>
        </table>
        <EditContestResultModal isOpen={isResultCreateModalOpen}
                                onSubmit={onResultSubmit}
                                onCancel={onResultEditCancel}
                                onDelete={onResultDeleteButtonClick}
                                data={editingRegistration?.result}/>
    </div>
}