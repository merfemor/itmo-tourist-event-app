import {useAuth} from "../../../auth/AuthStateHolder";
import {If} from "../../../utils/components";
import {RegisterMeButton} from "./RegisterMeButton";
import {RegisterParticipantBlock} from "./RegisterParticipantBlock";
import {SingleRegistrationsTable} from "./SingleRegistrationsTable";
import React from "react";

export function SingleRegistrationsContainer(props) {
    const {authInfo} = useAuth();
    const isLoggedIn = authInfo.user != null;

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
                <div className="col-6">
                    <RegisterParticipantBlock
                        contestId={props.contestId}
                        onRegistrationSuccessCallback={props.createSuccessCallback}/>
                </div>
            </div>
            <div className="table-responsive">
                <SingleRegistrationsTable registrations={props.data}/>
            </div>
        </If>
    );
}