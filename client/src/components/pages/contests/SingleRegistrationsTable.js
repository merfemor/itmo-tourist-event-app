import React from "react";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {httpTextRequest} from "../../../utils/http";
import {personFullName} from "../../../utils/language_utils";

export function SingleRegistrationsTable(props) {
    const registrations = props.registrations;
    const contestId = props.contestId;
    const deleteSuccessCallback = props.deleteSuccessCallback;

    function deleteParticipant(e, participantId) {
        e.preventDefault()
        httpTextRequest("DELETE", `contest/${contestId}/registration/single/${participantId}`)
            .then(deleteSuccessCallback)
    }

    return (
        <table className="table-outline mb-0 d-none d-sm-table table table-hover table-sm">
            <thead className="thead-default">
            <tr>
                <th className="text-center">№</th>
                <th>ФИО</th>
                <th className="text-center">Пол</th>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <th className="text-right pr-2">Действия</th>
                </If>
            </tr>
            </thead>
            <tbody>
            {registrations.map(it =>
                <tr key={it.participant.id}>
                    <th className="text-center">{it.participant.id}</th>
                    <th>
                        {personFullName(it.participant)}
                    </th>
                    <th className="text-center">
                        {it.participant.isMale ? "М" : "Ж"}
                    </th>
                    <If roleAtLeast={UserRole.VOLUNTEER}>
                        <th className="text-right pr-2">
                            <button className="btn btn-danger btn-sm" onClick={(e) => deleteParticipant(e, it.participant.id)}>
                                Удалить
                            </button>
                        </th>
                    </If>
                </tr>
            )}
            </tbody>
        </table>
    )
}