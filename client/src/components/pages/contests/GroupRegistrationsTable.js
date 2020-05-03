import React from "react";
import {UserRole} from "../../../api/enums";
import {If} from "../../../utils/components";

function renderGroupRegistrationCells(group) {
    const membersCount = group.members.length;
    return group.members.map((it, index) =>
        <tr key={`${group.id}/${it.id}`}>
            <If cond={index === 0}>
                <th rowSpan={membersCount}>{group.id}</th>
                <th rowSpan={membersCount}>{group.name}</th>
            </If>
            <th>
                {it.lastName + " " + it.firstName + " " + it.middleName}
            </th>
            <th>
                {it.isMale ? "М" : "Ж"}
            </th>
            <If cond={index === 0} roleAtLeast={UserRole.VOLUNTEER}>
                <th rowSpan={membersCount} className="text-right">
                     <button className="btn btn-danger btn-sm">Удалить</button>
                </th>
            </If>
        </tr>
    )
}

export function GroupRegistrationsTable(props) {
    const registrations = props.registrations;
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
            {registrations.map(it => renderGroupRegistrationCells(it))}
            </tbody>
        </table>
    );
}