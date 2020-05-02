import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ContestEdit from "./ContestEdit";
import ContestTable from "./ContestTable";
import ContestCreate from "./ContestCreate";

export default function ContestPageContent() {
    const match = useRouteMatch();
    return <div>
        <div className="container-fluid">
            <Switch>
                <Route path={`${match.path}/new`}>
                    <ContestCreate/>
                </Route>
                <Route path={`${match.path}/:contestId`}>
                    <ContestEdit/>
                </Route>
                <Route path={match.path}>
                    <ContestTable/>
                </Route>
            </Switch>
        </div>
    </div>;
}