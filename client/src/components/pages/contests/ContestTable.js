import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {httpJsonRequest} from "../../../utils/http";
import ContestTableCard from "./ContestTableCard";

export default function ContestTable() {
    const [contestsData, setContestsData] = useState([]);
    const match = useRouteMatch();

    useEffect(() => {
        httpJsonRequest('GET', 'contest')
            .then(response => setContestsData(response))
    }, []);

    function renderContestCards() {
        return contestsData.map(contest => {
            return <ContestTableCard key={contest.id} contest={contest}/>;
        })
    }

    return <div>
        <div className="row">
            <div className="col-3 col-sm-6 m-4">
                <Link to={`${match.url}/new`} className="btn btn-primary">Создать дистанцию</Link>
            </div>
        </div>
        <div className="row"> { renderContestCards() } </div>
    </div>
}