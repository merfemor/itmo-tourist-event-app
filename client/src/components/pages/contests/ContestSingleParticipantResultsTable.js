import React from "react";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {personFullName, resultToString} from "../../../utils/language_utils";

export function ContestSingleParticipantResultsTable(props) {
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
            <th>ФИО</th>
            <th>Результат</th>
            <If roleAtLeast={UserRole.VOLUNTEER}>
                <th className="text-right pr-2">Действия</th>
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
                <th className="text-center">
                    {resultToString(it.participant.result)}
                </th>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <th className="text-right pr-2">
                        <If cond={it.participant.result != null}>
                            <button className="btn btn-danger btn-sm" onClick={() => clearResult(it)}>
                                Удалить результат
                            </button>
                        </If>
                    </th>
                </If>
            </tr>
        )}
        </tbody>
    </table>
}