import React from "react";
import {UserRole} from "../../../api/enums";
import {If} from "../../../utils/components";
import {httpTextRequest} from "../../../utils/http";
import {personFullName} from "../../../utils/language_utils";

function renderGroupRegistrationCells(group, deleteButtonClickCallback) {
    const membersCount = group.members.length;
    return group.members.map((it, index) =>
        <tr key={`${group.id}/${it.id}`}>
            <If cond={index === 0}>
                <th rowSpan={membersCount}>{group.id}</th>
                <th rowSpan={membersCount}>{group.name}</th>
            </If>
            <th>
                {personFullName(it)}
            </th>
            <th>
                {it.isMale ? "М" : "Ж"}
            </th>
            <If cond={index === 0} roleAtLeast={UserRole.VOLUNTEER}>
                <th rowSpan={membersCount} className="text-right">
                     <button className="btn btn-danger btn-sm" onClick={deleteButtonClickCallback}>Удалить</button>
                </th>
            </If>
        </tr>
    )
}

export function GroupRegistrationsTable(props) {
    const registrations = props.registrations;

    function onDeleteButtonClick(registration) {
        httpTextRequest("DELETE", `contest/${registration.associatedContestId}/registration/${registration.id}`)
            .then(props.deleteSuccessCallback)
    }

    return (
        <table className="table-outline mb-0 d-none d-sm-table table table-hover table-sm">
            <thead className="thead-default">
            <tr>
                <th>№</th>
                <th>Название группы</th>
                <th>ФИО</th>
                <th>Пол</th>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <th className="text-right pr-2">Действия</th>
                </If>
            </tr>
            </thead>
            <tbody>
            {registrations.map(it => renderGroupRegistrationCells(it, () => onDeleteButtonClick(it)))}
            </tbody>
        </table>
    );
}