import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ParticipantType} from "../../../api/enums";
import {httpJsonRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {SingleRegistrationsTable} from "./SingleRegistrationsTable";
import {GroupRegistrationsTable} from "./GroupRegistrationsTable";


export default function ContestInfo() {
    const match = useRouteMatch();
    const {register, handleSubmit, errors} = useForm();
    const [contest, setContest] = useState(null);
    const contestId = match.params.contestId;

    useEffect(() => {
        httpJsonRequest("GET", "contest/" + contestId + "?includeRegistrations=true")
            .then(result => setContest(result))
    }, []);

    if (contest == null) {
        return <div/>
    }
    const isSingleParticipant = contest.participantType === ParticipantType.SINGLE.name;

    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h1>{contest.name}</h1>
                    </div>
                    <div className="card-body card-block">
                        <div className="row mb-4 ">
                            <div className="col-12">
                                <small>{contest.description}</small>
                                <div>Начало: {contest.startDateTime}</div>
                                <div>Окончание: {contest.endDateTime}</div>
                                <div>Структура результата: {contest.resultStructure}</div>
                                <div>Тип регистрации: {contest.registrationType}</div>
                                <div>Тип участника: {contest.participantType}</div>
                                <Link to={`${match.url}/edit`} className="mt-4 btn btn-primary">Редактировать</Link>
                            </div>
                        </div>
                        <h2>Регистрации</h2>
                        <If cond={isSingleParticipant && contest.singleParticipants != null}>
                            <div className="table-responsive">
                                <SingleRegistrationsTable registrations={contest.singleParticipants}/>
                            </div>
                        </If>
                        <If cond={!isSingleParticipant && contest.contestParticipantGroups != null}>
                            <div className="table-responsive">
                                <GroupRegistrationsTable registrations={contest.contestParticipantGroups}/>
                            </div>
                        </If>
                    </div>
                </div>
            </div>
        </div>
    )
}