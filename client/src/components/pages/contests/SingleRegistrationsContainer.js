import {useAuth} from "../../../auth/AuthStateHolder";
import {If} from "../../../utils/components";
import {RegisterMeButton} from "./RegisterMeButton";
import {RegisterParticipantBlock} from "./RegisterParticipantBlock";
import {SingleRegistrationsTable} from "./SingleRegistrationsTable";
import React from "react";

export function SingleRegistrationsContainer(props) {
    const {data, contestId, createSuccessCallback, deleteSuccessCallback} = props;
    const {authInfo} = useAuth();

    return (
        <div>
            <div className="d-flex mb-1">
                <RegisterMeButton className=""
                                  data={data}
                                  myId={authInfo.user?.id}
                                  contestId={contestId}
                                  createSuccessCallback={createSuccessCallback}
                                  deleteSuccessCallback={deleteSuccessCallback}
                />
                <div className="ml-2 w-100">
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
        </div>
    );
}