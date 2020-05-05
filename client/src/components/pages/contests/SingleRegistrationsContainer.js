import {useAuth} from "../../../auth/AuthStateHolder";
import {If} from "../../../utils/components";
import {RegisterMeButton} from "./RegisterMeButton";
import {RegisterParticipantBlock} from "./RegisterParticipantBlock";
import {SingleRegistrationsTable} from "./SingleRegistrationsTable";
import React from "react";

export function SingleRegistrationsContainer(props) {
    const {data, contestId, createSuccessCallback, deleteSuccessCallback} = props;
    const {authInfo} = useAuth();
    const isLoggedIn = authInfo.user != null;

    return (
        <If cond={isLoggedIn}>
            <div className="row mb-1">
                <RegisterMeButton className="col-4"
                                  data={data}
                                  myId={authInfo.user.id}
                                  contestId={contestId}
                                  createSuccessCallback={createSuccessCallback}
                                  deleteSuccessCallback={deleteSuccessCallback}
                />
                <div className="col-8">
                    <RegisterParticipantBlock
                        contestId={contestId}
                        onRegistrationSuccessCallback={createSuccessCallback}/>
                </div>
            </div>
            <div className="table-responsive">
                <SingleRegistrationsTable
                    registrations={data}
                    contestId={contestId}
                    deleteSuccessCallback={deleteSuccessCallback}
                />
            </div>
        </If>
    );
}