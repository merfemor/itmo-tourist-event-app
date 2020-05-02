import React from 'react';
import ParticipantsTable from "./ParticipantsTable";
import {Route, Switch} from "react-router-dom";

export default function ParticipantsPageContent() {
    return (
        <div className="container-fluid">
            <div className="row">
                <Switch>
                    <Route path="/">
                        <ParticipantsTable/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}