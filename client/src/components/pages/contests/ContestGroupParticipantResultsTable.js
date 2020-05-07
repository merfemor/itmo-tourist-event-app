import React, {useState} from "react";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {personFullName, resultToString} from "../../../utils/language_utils";
import {EditContestResultModal} from "./CreateResultModal";
import {httpTextRequest} from "../../../utils/http";

export function ContestGroupParticipantResultsTable(props) {
    const contestId = props.contestId
    const data = props.data
    const onChangeCallback = props.onChange

    const [isResultCreateModalOpen, setResultCreateModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState(null)

    function updateResult(registration, newResult) {
        const memberIds = registration.members?.map(it => it.id)
        const newRegistration = {
            ...registration,
            result: newResult,
            participantIds: memberIds,
            members: undefined,
            registrationId: registration.id,
            id: undefined,
            groupName: registration.name,
            name: undefined,
            associatedContestId: undefined,
        }
        httpTextRequest("PUT", `contest/${contestId}/registration`, newRegistration)
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

    function onResultEditCancel(result) {
        setEditingRegistration(null)
        setResultCreateModalOpen(false)
    }

    function onResultSubmit(result) {
        updateResult(editingRegistration, result)
    }

    function onCreateResultButtonClick(it) {
        setEditingRegistration(it)
        setResultCreateModalOpen(true)
    }

    return <div>
        <table className="table-outline table table-hover table-sm">
            <thead className="thead-default">
            <tr>
                <th className="text-center">№</th>
                <th>Название группы</th>
                <th>Капитан</th>
                <th>Результат</th>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <th className="text-right pr-2">Действия</th>
                </If>
            </tr>
            </thead>
            <tbody>
            {data.map(it =>
                <tr key={it.id}>
                    <th className="text-center">{it.id}</th>
                    <th>
                        {it.name}
                    </th>
                    <th>
                        {personFullName(it.members[0])}
                    </th>
                    <th className="text-center">
                        {resultToString(it.result)}
                    </th>
                    <If roleAtLeast={UserRole.VOLUNTEER}>
                        <th className="text-right pr-2">
                            <If cond={it.result != null}>
                                <button className="btn btn-primary btn-sm"
                                        onClick={() => onEditResultButtonClick(it)}>
                                    <i className="fa fa-pencil"/><span className="d-sm-down-none"> Редактировать</span>
                                </button>
                            </If>
                            <If cond={it.result == null}>
                                <button className="btn btn-success btn-sm"
                                        onClick={() => onCreateResultButtonClick(it)}>
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