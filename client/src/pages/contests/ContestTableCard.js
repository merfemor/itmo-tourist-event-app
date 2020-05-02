import React from "react";
import {Link} from "react-router-dom";

export default function ContestTableCard(props) {
    const contest = props.contest;

    return (
        <div className="col-12 col-sm-12 col-lg-6">
            <div className="card">
                <div className="card-body card-block">
                    <div className="h4 m-0">{contest.name}</div>
                    <div>Начало: {contest.startDateTime}</div>
                    <div>Окончание: {contest.endDateTime}</div>
                    <div>Структура результата: {contest.resultStructure}</div>
                    <div>Тип регистрации: {contest.registrationType}</div>
                    <div>Тип участника: {contest.participantType}</div>
                    <small>{contest.desc}</small>
                </div>
                <div className="card-footer">
                    <Link to={`/contests/${contest.id}`} className="font-weight-bold font-xs btn-block text-muted">
                        Редактировать
                        <i className="fa fa-angle-right float-right font-lg"/>
                    </Link>
                </div>
            </div>
        </div>
    );
}