import React from "react";
import {Link} from "react-router-dom";
import {ContestDescriptionBlock} from "./ContestDescriptionBlock";

export default function ContestTableCard(props) {
    const contest = props.contest;

    return (
        <div className="col-12 col-sm-12 col-lg-6">
            <div className="card">
                <div className="card-body card-block">
                    <div className="h4">{contest.name}</div>
                    <ContestDescriptionBlock data={contest}/>
                </div>
                <div className="card-footer">
                    <Link to={`/contests/${contest.id}`} className="font-weight-bold font-xs btn-block text-muted">
                         Подробнее
                        <i className="fa fa-angle-right float-right font-lg"/>
                    </Link>
                </div>
            </div>
        </div>
    );
}