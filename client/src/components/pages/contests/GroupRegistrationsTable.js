import React from "react";

function renderGroupRegistrationCells(group) {
    const membersCount = group.members.length;
    return group.members.map((it, index) =>
        <tr key={`${group.id}/${it.id}`}>
            {index === 0 && <th rowSpan={membersCount}>{group.id}</th>}
            {index === 0 && <th rowSpan={membersCount}>{group.name}</th>}
            <th>
                {it.lastName + " " + it.firstName + " " + it.middleName}
            </th>
            <th>
                {it.isMale ? "М" : "Ж"}
            </th>
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
            </tr>
            </thead>
            <tbody>
            {registrations.map(it => renderGroupRegistrationCells(it))}
            </tbody>
        </table>
    );
}