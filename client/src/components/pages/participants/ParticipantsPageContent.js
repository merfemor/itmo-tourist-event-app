import React from 'react';
import ParticipantsTable from "./ParticipantsTable";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ParticipantEditForm from "./ParticipantEditForm";
import ParticipantRegisterForm from "./ParticipantRegisterForm";
import {PrivateRoute} from "../../../auth/PrivateRoute";
import {UserRole} from "../../../api/enums";

export default function ParticipantsPageContent() {
    const match = useRouteMatch();
    return (
        <div className="row">
            <Switch>
                <PrivateRoute roleAtLeast={UserRole.VOLUNTEER} path={`${match.path}/new`} component={ParticipantRegisterForm}/>
                <PrivateRoute roleAtLeast={UserRole.VOLUNTEER} path={`${match.path}/:participantId`} component={ParticipantEditForm}/>
                <Route path={match.path} component={ParticipantsTable}/>
            </Switch>
        </div>
    )
}