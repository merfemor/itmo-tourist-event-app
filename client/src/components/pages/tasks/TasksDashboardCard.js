import React, {useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {If} from "../../../utils/components";
import {httpJsonRequest} from "../../../utils/http";
import {dateTimeToString, personShortName} from "../../../utils/language_utils";
import {UserRole} from "../../../api/enums";

export default function TasksDashboardCard(props) {
    const {url} = useRouteMatch()
    const [data, setData] = useState(props.data)

    function changeTaskStatus() {
        httpJsonRequest("PUT", "task", {...data, isDone: !data.isDone})
            .then(setData)
    }

    return (
        <div className="card">
            <div className="card-body card-block">
                <div>
                    <h5>{data.name}</h5>
                </div>
                <div>
                    <b>Статус: </b>
                    <If cond={data.isDone}>
                        <span className="badge badge-success">Завершен</span>
                    </If>
                    <If cond={!data.isDone}>
                        <span className="badge badge-primary">Открыт</span>
                    </If>
                </div>
                {data.startDateTime != null &&
                <div>
                    <b>Начало: </b>
                    {dateTimeToString(data.startDateTime)}
                </div>
                }
                {data.endDateTime != null &&
                <div>
                    <b>Конец: </b>
                    {dateTimeToString(data.endDateTime)}
                </div>
                }
                {data.assignee != null &&
                <div>
                    <b>Исполнитель</b>: {personShortName(data.assignee)}
                </div>
                }
                {data.associatedContest != null &&
                <div>
                    <b>Для дистанции: </b>
                    <Link to={`/contests/${data.associatedContest.id}`}>{data.associatedContest.name}</Link>
                </div>
                }
                <div className="mb-2"/>
                <If cond={data.description != null && data.description !== ""}>
                    <div className="mb-2">
                        <b>Описание: </b> <br/>
                        <i>{data.description}</i>
                    </div>
                </If>
                <div className="mt-2 d-flex">
                    <div>
                        <button className={`btn btn-${data.isDone ? "warning" : "success"}`}
                                onClick={changeTaskStatus}>
                            {data.isDone ? "Переоткрыть" : "Завершить"}
                        </button>
                    </div>
                    <If roleAtLeast={UserRole.ORGANIZER}>
                        <div className="ml-2">
                            <Link to={`${url}/${data.id}`} className="btn btn-primary">
                                Редактировать
                            </Link>
                        </div>
                    </If>
                </div>
            </div>
        </div>
    );
}