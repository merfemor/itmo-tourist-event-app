import React, {useEffect, useState} from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import TaskCreate from "./TaskCreate";
import TasksDashboard from "./TasksDashboard";
import TaskEdit from "./TaskEdit";
import {httpJsonRequest} from "../../../utils/http";

function TasksDashboardWithData() {
    const [data, setData] = useState([])
    useEffect(() => {
        httpJsonRequest('GET', 'tasks')
            .then(response => setData(response))
    }, []);

    return <TasksDashboard data={data}/>
}

export default function TasksPageContent() {
    const match = useRouteMatch();

    return <div>
        <Switch>
            <Route path={`${match.path}/new`}>
                <TaskCreate/>
            </Route>
            <Route path={`${match.path}/:taskId`}>
                <TaskEdit/>
            </Route>
            <Route path={match.path}>
                <TasksDashboardWithData/>
            </Route>
        </Switch>
    </div>;
}