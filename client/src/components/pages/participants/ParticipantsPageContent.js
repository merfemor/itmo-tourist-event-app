import React from 'react';
import ParticipantsTable from "./ParticipantsTable";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ParticipantEditForm from "./ParticipantEditForm";
import ContestCreate from "../contests/ContestCreate";

export default function ParticipantsPageContent() {
    const match = useRouteMatch();
    return (
        <div className="container-fluid">
            <div className="row">
                <Switch>
                    <Route path={`${match.path}/new`}>
                        Participant register form
                    </Route>
                    <Route path={`${match.path}/:participantId`}>
                        <ParticipantEditForm/>
                    </Route>
                    <Route path={match.path}>
                        <ParticipantsTable/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}