import React from "react";
import {If} from "../../../utils/components";
import {enumToLocaleString, ParticipantType, RegistrationType, ResultStructure} from "../../../api/enums";
import {dateTimeToString} from "../../../utils/language_utils";

export function ContestDescriptionBlock(props) {
    const contest = props.data;
    return <div className={props.className}>
        <div><b>Начало:</b> {dateTimeToString(contest.startDateTime)}</div>
        <div><b>Окончание:</b> {dateTimeToString(contest.endDateTime)}</div>
        <div><b>Структура результата:</b> {enumToLocaleString(ResultStructure, contest.resultStructure)}</div>
        <div><b>Тип регистрации:</b> {enumToLocaleString(RegistrationType, contest.registrationType)}</div>
        <div><b>Тип участника:</b> {enumToLocaleString(ParticipantType, contest.participantType)}</div>
        <If cond={contest.description != null && contest.description !== ""}>
            <div className="mt-1"><i> {contest.description}</i></div>
        </If>
    </div>
}