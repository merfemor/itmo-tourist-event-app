import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import CreateContest from "./CreateContest";
import ContestTable from "./ContestTable";

export default function ContestsPageContent() {
    const match = useRouteMatch();
    return <div>
        <div className="container-fluid">
            <Switch>
                <Route path={`${match.path}/new`}>
                    <CreateContest/>
                </Route>
                <Route path={`${match.path}/:contestId`}>
                    <CreateContest/>
                </Route>
                <Route path={match.path}>
                    <ContestTable/>
                </Route>
            </Switch>
        </div>
    </div>;
}