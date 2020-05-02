import React from "react";
import {Link, useRouteMatch} from "react-router-dom";

export default function ContestTable() {
    const match = useRouteMatch();
    return <div>
        <Link to={`${match.url}/new`} className="btn btn-primary">Создать дистанцию</Link>
        Table will be here
    </div>
}