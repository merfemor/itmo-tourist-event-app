import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {ParticipantType, UserRole} from "../../../api/enums";
import {httpJsonRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {GroupRegistrationsTable} from "./GroupRegistrationsTable";
import {SingleRegistrationsContainer} from "./SingleRegistrationsContainer";


export default function ContestInfo() {
    const match = useRouteMatch();
    const [contest, setContest] = useState(null);
    const contestId = match.params.contestId;

    function loadContest() {
        httpJsonRequest("GET", "contest/" + contestId + "?includeRegistrations=true")
            .then(result => setContest(result))
    }

    useEffect(() => {
        loadContest()
    }, []);

    if (contest == null) {
        return <div/>
    }
    const isSingleParticipant = contest.participantType === ParticipantType.SINGLE.name;

    function onActionDone() {
        loadContest()
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h1>{contest.name}</h1>
                    </div>
                    <div className="card-body card-block">
                        <div className="row mb-4">
                            <div className="col-12">
                                <small>{contest.description}</small>
                                <div>Начало: {contest.startDateTime}</div>
                                <div>Окончание: {contest.endDateTime}</div>
                                <div>Структура результата: {contest.resultStructure}</div>
                                <div>Тип регистрации: {contest.registrationType}</div>
                                <div>Тип участника: {contest.participantType}</div>
                                <If roleAtLeast={UserRole.VOLUNTEER}>
                                    <Link to={`${match.url}/edit`} className="mt-4 btn btn-primary">Редактировать</Link>
                                </If>
                            </div>
                        </div>
                        <h2>Регистрации</h2>
                        <If cond={isSingleParticipant && contest.singleParticipants != null}>
                            <SingleRegistrationsContainer
                                contestId={contestId}
                                data={contest.singleParticipants}
                                createSuccessCallback={onActionDone}
                                deleteSuccessCallback={onActionDone}
                            />
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