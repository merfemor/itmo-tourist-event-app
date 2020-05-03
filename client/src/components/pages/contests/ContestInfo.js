import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {ParticipantType, UserRole} from "../../../api/enums";
import {httpJsonRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {GroupRegistrationsTable} from "./GroupRegistrationsTable";
import {SingleRegistrationsContainer} from "./SingleRegistrationsContainer";
import {ContestDescriptionBlock} from "./ContestDescriptionBlock";

function RegisterGroupBlock(props) {
    const data = props.data;
    const contestId = props.contestId;
    const createSuccessCallback = props.createSuccessCallback;

    return <div className="row">
        <div className="col-3">
            <button className="btn btn-primary">Зарегистрировать группу</button>
        </div>
    </div>
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
                                <ContestDescriptionBlock data={contest}/>
                                <If roleAtLeast={UserRole.VOLUNTEER}>
                                    <Link to={`${match.url}/edit`} className="mt-4 btn btn-primary">Редактировать</Link>
                                </If>
                            </div>
                        </div>
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
                            <h2>Группы</h2>
                            <If roleAtLeast={UserRole.VOLUNTEER}>
                                <div className="mb-2">
                                    <RegisterGroupBlock
                                        contestId={contestId}
                                        data={contest.contestParticipantGroups}
                                        createSuccessCallback={onActionDone}
                                    />
                                </div>
                            </If>
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