import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {httpJsonRequest} from "../../../utils/http";
import {UserRole} from "../../../api/enums";
import {If} from "../../../utils/components";
import TasksDashboardCard from "./TasksDashboardCard";

export default function TasksDashboard() {
    const [dataList, setData] = useState([]);
    const match = useRouteMatch();

    useEffect(() => {
        httpJsonRequest('GET', 'tasks')
            .then(response => setData(response))
    }, []);

    return <div>
        <If roleAtLeast={UserRole.VOLUNTEER}>
            <Link to={`${match.url}/new`} className="btn btn-primary mt-3">Создать задачу</Link>
        </If>
        <div className="row mt-3">
            {dataList.map(it =>
                <div className="col-sm-6 col-xs-12">
                    <TasksDashboardCard key={it.id} data={it}/>
                </div>
            )}
        </div>
    </div>
}