import React from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {UserRole} from "../../../api/enums";
import {If} from "../../../utils/components";
import TasksDashboardCard from "./TasksDashboardCard";

export default function TasksDashboard(props) {
    const match = useRouteMatch()
    const dataList = props.data

    return <div>
        <If roleAtLeast={UserRole.ORGANIZER}>
            <Link to={`${match.url}/new`} className="btn btn-success mt-1"><i className="fa fa-plus"/> Создать задачу</Link>
        </If>
        <div className="row mt-3">
            {dataList.map(it =>
                <div key={it.id} className="col-sm-12 col-xs-12 col-md-6">
                    <TasksDashboardCard data={it}/>
                </div>
            )}
        </div>
    </div>
}