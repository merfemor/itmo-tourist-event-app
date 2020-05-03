import React from "react";

export function SingleRegistrationsTable(props) {
    const registrations = props.registrations
    return (
        <table className="table-outline mb-0 d-none d-sm-table table table-hover table-sm">
            <thead className="thead-default">
            <tr>
                <th>№</th>
                <th>ФИО</th>
                <th>Пол</th>
            </tr>
            </thead>
            <tbody>
            {registrations.map(it =>
                <tr key={it.participant.id}>
                    <th>{it.participant.id}</th>
                    <th>
                        {it.participant.lastName + " " + it.participant.firstName + " " + it.participant.middleName}
                    </th>
                    <th>
                        {it.participant.isMale ? "М" : "Ж"}
                    </th>
                </tr>
            )}
            </tbody>
        </table>
    )
}