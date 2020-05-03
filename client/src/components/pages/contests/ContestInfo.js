import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {ParticipantType, UserRole} from "../../../api/enums";
import {httpJsonRequest, httpTextRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {SingleRegistrationsTable} from "./SingleRegistrationsTable";
import {GroupRegistrationsTable} from "./GroupRegistrationsTable";
import {useAuth} from "../../../auth/AuthStateHolder";


function RegisterMeButton(props) {
    const data = props.data;
    const createSuccessCallback = props.createSuccessCallback;
    const deleteSuccessCallback = props.deleteSuccessCallback;
    const contestId = props.contestId;
    const myId = props.myId;
    const isRegistered = data.find(it => it.participantId === myId) != null;

    function onRegisterButtonClick() {
        httpTextRequest("POST", `contest/${contestId}/registration`, {
            participantId: myId,
            contestId: contestId
        }).then(() => createSuccessCallback(myId))
    }

    function onDeleteRegisterButtonClick() {
        httpTextRequest("DELETE", `contest/${contestId}/registration/single/${myId}`)
            .then(() => deleteSuccessCallback(myId))
    }

    return (
        <div>
            <If cond={isRegistered}>
                <button className="btn btn-danger" onClick={onDeleteRegisterButtonClick}>
                    Не буду участвовать
                </button>
            </If>
            <If cond={!isRegistered}>
                <button className="btn btn-success" onClick={onRegisterButtonClick}>
                    Зарегистрировать себя
                </button>
            </If>
        </div>
    )
}

function SingleRegistrationBlock(props) {
    const {authInfo} = useAuth();
    const isLoggedIn = authInfo.user != null;

    function onRegisterAnotherParticipantButtonClick() {
        // TODO: impl
        console.warn("Not implemented")
    }

    return (
        <If cond={isLoggedIn}>
            <div className="row mb-3">
                <div className="col-3">
                    <RegisterMeButton data={props.data}
                                      myId={authInfo.user.id}
                                      contestId={props.contestId}
                                      createSuccessCallback={props.createSuccessCallback}
                                      deleteSuccessCallback={props.deleteSuccessCallback}
                    />
                </div>
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <div className="col-3">
                        <button className="btn btn-primary" onClick={onRegisterAnotherParticipantButtonClick}>
                            Зарегистрировать участника
                        </button>
                    </div>
                </If>
            </div>
            <div className="table-responsive">
                <SingleRegistrationsTable registrations={props.data}/>
            </div>
        </If>
    );
}

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
                                <Link to={`${match.url}/edit`} className="mt-4 btn btn-primary">Редактировать</Link>
                            </div>
                        </div>
                        <h2>Регистрации</h2>
                        <If cond={isSingleParticipant && contest.singleParticipants != null}>
                            <SingleRegistrationBlock
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