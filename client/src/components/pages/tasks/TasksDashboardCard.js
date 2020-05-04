import React, {useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import {If} from "../../../utils/components";
import {httpJsonRequest} from "../../../utils/http";
import {dateTimeToString, personShortName} from "../../../utils/language_utils";

export default function TasksDashboardCard(props) {
    const {url} = useRouteMatch()
    const [data, setData] = useState(props.data)

    function changeTaskStatus() {
        httpJsonRequest("PUT", "task", {...data, isDone: !data.isDone})
            .then(setData)
    }

    return (
        <div className="card">
            <div className="card-header">
                <b>{data.name}</b>
                <If cond={data.isDone}>
                    <span className="float-right badge badge-success">Завершен</span>
                </If>
                <If cond={!data.isDone}>
                    <span className="float-right badge badge-primary">Открыт</span>
                </If>
            </div>
            <div className="card-body card-block">
                {data.startDateTime != null &&
                    <div>
                        <b>Начало: </b>
                        { dateTimeToString(data.startDateTime)}
                    </div>
                }
                {data.endDateTime != null &&
                <div>
                    <b>Конец: </b>
                    { dateTimeToString(data.endDateTime)}
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
                <div className="row">
                    <div className="col-6">
                        <button className={`btn btn-${data.isDone ? "warning" : "success"}`}
                                onClick={changeTaskStatus}>
                            {data.isDone ? "Переоткрыть" : "Завершить"}
                        </button>
                    </div>
                    <div className="col-6">
                        <Link to={`${url}/${data.id}`} className="btn btn-primary">
                            Редактировать
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}