import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ContestEdit from "./ContestEdit";
import ContestTable from "./ContestTable";
import ContestCreate from "./ContestCreate";
import ContestInfo from "./ContestInfo";
import TaskCreate from "../tasks/TaskCreate";
import TaskEdit from "../tasks/TaskEdit";

function ContestTaskCreate() {
    const {params} = useRouteMatch()
    return <TaskCreate associatedContestId={params.contestId}/>
}

export default function ContestPageContent() {
    const match = useRouteMatch();
    return <div>
        <Switch>
            <Route path={`${match.path}/new`} component={ContestCreate}/>
            <Route path={`${match.path}/:contestId/edit`} component={ContestEdit}/>
            <Route path={`${match.path}/:contestId/new`} component={ContestTaskCreate}/>
            <Route path={`${match.path}/:contestId/:taskId`} component={TaskEdit}/>
            <Route path={`${match.path}/:contestId`} component={ContestInfo}/>
            <Route path={match.path} component={ContestTable}/>
        </Switch>
    </div>;
}