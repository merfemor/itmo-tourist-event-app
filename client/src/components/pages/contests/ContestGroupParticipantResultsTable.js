import React from "react";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {personFullName, resultToString} from "../../../utils/language_utils";

export function ContestGroupParticipantResultsTable(props) {
    const data = props.data
    const onChangeCallback = props.onChange

    function clearResult(it) {
        // TODO: implement
        onChangeCallback()
    }

    return <table className="table-outline table table-hover table-sm">
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
                        <button className="btn btn-danger btn-sm" onClick={() => clearResult(it)}>
                            Удалить результат
                        </button>
                    </th>
                </If>
            </tr>
        )}
        </tbody>
    </table>
}