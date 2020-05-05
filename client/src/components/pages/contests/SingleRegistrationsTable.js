import React from "react";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {httpTextRequest} from "../../../utils/http";
import {personFullName} from "../../../utils/language_utils";

export function SingleRegistrationsTable(props) {
    const {registrations, contestId, deleteSuccessCallback} = props;

    function deleteParticipant(e, participantId) {
        e.preventDefault()
        httpTextRequest("DELETE", `contest/${contestId}/registration/single/${participantId}`)
            .then(deleteSuccessCallback)
    }

    return (
        <table className="table-outline table table-hover table-sm">
            <thead className="thead-default">
            <tr>
                <th className="text-center">№</th>
                <th>ФИО</th>
                <th className="text-center">Пол</th>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <th className="text-right"><span className="pr-2 d-sm-down-none">Действия</span></th>
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
                            <button className="btn btn-link text-danger btn-sm" onClick={(e) => deleteParticipant(e, it.participant.id)}>
                                <i className="fa fa-trash"/>
                                <span className="d-xs-down-none"> Удалить</span>
                            </button>
                        </th>
                    </If>
                </tr>
            )}
            </tbody>
        </table>
    )
}