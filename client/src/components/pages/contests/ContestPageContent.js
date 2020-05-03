import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ContestEdit from "./ContestEdit";
import ContestTable from "./ContestTable";
import ContestCreate from "./ContestCreate";
import ContestInfo from "./ContestInfo";

export default function ContestPageContent() {
    const match = useRouteMatch();
    return <div>
        <div className="container-fluid">
            <Switch>
                <Route path={`${match.path}/new`}>
                    <ContestCreate/>
                </Route>
                <Route path={`${match.path}/:contestId/edit`}>
                    <ContestEdit/>
                </Route>
                <Route path={`${match.path}/:contestId`}>
                    <ContestInfo/>
                </Route>
                <Route path={match.path}>
                    <ContestTable/>
                </Route>
            </Switch>
        </div>
    </div>;
}