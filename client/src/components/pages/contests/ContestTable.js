import React, {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {httpJsonRequest} from "../../../utils/http";
import ContestTableCard from "./ContestTableCard";
import {UserRole} from "../../../api/enums";
import {If} from "../../../utils/components";

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
        <If roleAtLeast={UserRole.ORGANIZER}>
            <Link to={`${match.url}/new`} className="btn btn-success px-3"><i className="fa fa-plus"/> Создать дистанцию</Link>
        </If>
        <div className="row mt-2"> {renderContestCards()} </div>
    </div>
}