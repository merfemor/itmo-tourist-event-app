import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ContestEdit from "./ContestEdit";
import ContestTable from "./ContestTable";

export default function ContestPageContent() {
    const match = useRouteMatch();
    return <div>
        <div className="container-fluid">
            <Switch>
                <Route path={`${match.path}/new`}>
                    <ContestEdit/>
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