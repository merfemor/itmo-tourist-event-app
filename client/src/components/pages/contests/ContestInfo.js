import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {ParticipantType, UserRole} from "../../../api/enums";
import {httpJsonRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {GroupRegistrationsTable} from "./GroupRegistrationsTable";
import {SingleRegistrationsContainer} from "./SingleRegistrationsContainer";
import {ContestDescriptionBlock} from "./ContestDescriptionBlock";
import {RegisterGroupBlock} from "./RegisterGroupBlock";
import {ContestTasksContainer} from "./ContestTasksContainer";
import {ContestResultsContainer} from "./ContestResultsContainer";
import {useAuth} from "../../../auth/AuthStateHolder";


export default function ContestInfo() {
    const match = useRouteMatch();
    const { authInfo } = useAuth();
    const [contest, setContest] = useState(null);
    const contestId = match.params.contestId;
    const isLoggedIn = authInfo.user != null;

    function loadContest() {
        httpJsonRequest("GET", "contest/" + contestId + "?includeRegistrations=true&includeTasks=true")
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
                                <ContestDescriptionBlock data={contest}/>
                                <If roleAtLeast={UserRole.ORGANIZER}>
                                    <Link to={`${match.url}/edit`} className="mt-2"><i className="fa fa-pencil"/> Редактировать</Link>
                                </If>
                            </div>
                        </div>
                        { isLoggedIn &&
                            <div>
                                <h2>Связанные задачи</h2>
                                <ContestTasksContainer
                                    contestId={contestId}
                                    data={contest.tasks}
                                    onSuccess={onActionDone}/>
                            </div>
                        }
                        <If cond={isSingleParticipant && contest.singleParticipants != null}>
                            <h2>Участники</h2>
                            <SingleRegistrationsContainer
                                contestId={contestId}
                                data={contest.singleParticipants}
                                createSuccessCallback={onActionDone}
                                deleteSuccessCallback={onActionDone}
                            />
                        </If>
                        <If cond={!isSingleParticipant && contest.contestParticipantGroups != null}>
                            <h2>Участники</h2>
                            <If roleAtLeast={UserRole.VOLUNTEER}>
                                <div className="mb-2">
                                    <RegisterGroupBlock
                                        contestId={contestId}
                                        createSuccessCallback={onActionDone}
                                    />
                                </div>
                            </If>
                            <div className="table-responsive">
                                <GroupRegistrationsTable
                                    registrations={contest.contestParticipantGroups}
                                    deleteSuccessCallback={onActionDone}
                                />
                            </div>
                        </If>
                        <h2>Результаты</h2>
                        <ContestResultsContainer data={contest} onChange={onActionDone}/>
                    </div>
                </div>
            </div>
        </div>
    )
}