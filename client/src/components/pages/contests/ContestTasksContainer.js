import TasksDashboard from "../tasks/TasksDashboard";
import React from "react";

export function ContestTasksContainer(props) {
    const data = props.data

    return <div>
        <TasksDashboard data={data}/>
    </div>
}