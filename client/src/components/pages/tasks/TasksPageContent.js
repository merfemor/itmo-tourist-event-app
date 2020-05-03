import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import TaskCreate from "./TaskCreate";
import TasksDashboard from "./TasksDashboard";
import TaskEdit from "./TaskEdit";

export default function TasksPageContent() {
    const match = useRouteMatch();
    return <div>
        <div className="container-fluid">
            <Switch>
                <Route path={`${match.path}/new`}>
                    <TaskCreate/>
                </Route>
                <Route path={`${match.path}/:taskId`}>
                    <TaskEdit/>
                </Route>
                <Route path={match.path}>
                    <TasksDashboard/>
                </Route>
            </Switch>
        </div>
    </div>;
}