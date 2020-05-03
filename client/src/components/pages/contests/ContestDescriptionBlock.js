import React from "react";
import {If} from "../../../utils/components";

export function ContestDescriptionBlock(props) {
    const contest = props.data;
    return <div className={props.className}>
        <div><b>Начало:</b> {contest.startDateTime}</div>
        <div><b>Окончание:</b> {contest.endDateTime}</div>
        <div><b>Структура результата:</b> {contest.resultStructure}</div>
        <div><b>Тип регистрации:</b> {contest.registrationType}</div>
        <div><b>Тип участника:</b> {contest.participantType}</div>
        <If cond={contest.description != null && contest.description !== ""}>
            <div className="mt-1"><i> {contest.description}</i></div>
        </If>
    </div>
}