import React, {useEffect, useState} from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import TaskCreate from "./TaskCreate";
import TasksDashboard from "./TasksDashboard";
import TaskEdit from "./TaskEdit";
import {httpJsonRequest} from "../../../utils/http";
import {PrivateRoute} from "../../../auth/PrivateRoute";
import {UserRole} from "../../../api/enums";

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
            <PrivateRoute roleAtLeast={UserRole.ORGANIZER} path={`${match.path}/new`} component={TaskCreate}/>
            <PrivateRoute roleAtLeast={UserRole.VOLUNTEER} path={`${match.path}/:taskId`} component={TaskEdit}/>
            <Route path={match.path} component={TasksDashboardWithData}/>
        </Switch>
    </div>;
}