import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {useForm} from "react-hook-form";
import {httpJsonRequest, httpTextRequest} from "../../../utils/http";
import PersonSearchDropdownInput from "../../forms/PersonSearchDropdownInput";
import {TaskAssigneeSuggestButton} from "./TaskAssigneeSuggestButton";
import {
    dateIntervalToString,
    DATETIME_RANGE_CONTAINER_LOCAL,
    momentFromServerJsonVal, momentToServerJsonVal
} from "../../../utils/language_utils";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import {getDefaultEndDateTimeForTask, getDefaultStartDateTimeForTask} from "./TaskCreate";

export default function TaskEdit() {
    const { params } = useRouteMatch();
    const taskId = params.taskId;
    const history = useHistory();
    const {register, handleSubmit, errors, getValues} = useForm();
    const [data, setData] = useState(null);
    const [state, setState] = useState({
        startDateTime: getDefaultStartDateTimeForTask(),
        endDateTime: getDefaultEndDateTimeForTask(),
        isSet: false
    });

    useEffect(() => {
        httpJsonRequest("GET", `task/${taskId}`)
            .then(response => {
                setData(response)
                if (response.startDateTime != null && response.endDateTime != null) {
                    setState({
                        startDateTime: momentFromServerJsonVal(response.startDateTime),
                        endDateTime: momentFromServerJsonVal(response.endDateTime),
                        isSet: true
                    })
                }
            })
    }, []);

    if (data == null) {
        return <div/>
    }

    function onFormSubmit(formData) {
        const newData = {
            ...data,
            ...formData,
            assigneeId: data.assignee?.id,
            assignee: null
        }
        if (state.isSet) {
            newData.startDateTime = momentToServerJsonVal(state.startDateTime)
            newData.endDateTime = momentToServerJsonVal(state.endDateTime)
        }
        httpJsonRequest("PUT", "task", newData)
            .then(history.goBack);
    }

    function onDeleteButtonClick(e) {
        e.preventDefault() // prevent form submit
        httpTextRequest("DELETE", `task/${params.taskId}`)
            .then(history.goBack)
    }

    function onAssigneeChange(newAssignee) {
        setData((oldData) => ({...oldData, assignee: newAssignee}))
    }

    function onAssigneeSuggestResult(assignee) {
        if (assignee != null) {
            setData((state) => ({...state, assignee: assignee}))
        }
    }

    function onDateTimesChange(newStartDateTime, newEndDateTime) {
        setState({
            startDateTime: newStartDateTime,
            endDateTime: newEndDateTime,
            isSet: true
        })
    }

    return (
        <div className="row">
            <div className="col-md-8 col-xs-12 mx-auto">
                <div className="card">
                    <div className="card-header"><strong>Редактировать задачу</strong></div>
                    <div className="card-body card-block">
                        <form
                            onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="form-group">
                                <label htmlFor="name-input" className="form-control-label">Название</label>
                                <input type="text" id="name-input" placeholder="Введите название"
                                       defaultValue={data.name}
                                       className={"form-control" + (errors.name ? " is-invalid" : "")}
                                       name="name"
                                       ref={register({
                                           required: true
                                       })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description-input" className="form-control-label">Описание</label>
                                <textarea id="description-input" placeholder="Введите описание"
                                          defaultValue={data.description}
                                          className={"form-control" + (errors.description ? " is-invalid" : "")}
                                          name="description" ref={register}/>
                            </div>
                            <DateTimeRangeContainer start={state.startDateTime} end={state.endDateTime}
                                                    local={DATETIME_RANGE_CONTAINER_LOCAL}
                                                    applyCallback={onDateTimesChange}>
                                <div className="form-group">
                                    <label htmlFor="start-date-time-input" className="form-control-label">Промежуток</label>
                                    <input type="text" id="start-date-time-input" className="form-control"
                                           required={true}
                                           placeholder="Укажите промежуток"
                                           value={state.isSet ? dateIntervalToString(state.startDateTime, state.endDateTime) : "" }
                                    />
                                </div>
                            </DateTimeRangeContainer>
                            <div className="form-group">
                                <label htmlFor="assignee-search-dropdown-input"
                                       className="form-control-label">
                                    Исполнитель
                                </label>
                                <div className="input-group">
                                    <PersonSearchDropdownInput id="assignee-search-dropdown-input"
                                                               value={data.assignee}
                                                               onChange={onAssigneeChange}
                                                               placeholderText="Начните вводить имя"

                                    />
                                </div>
                                <TaskAssigneeSuggestButton
                                    className="btn-link"
                                    disabled={data.assignee != null}
                                    data={getValues}
                                    onResult={onAssigneeSuggestResult}>
                                    Найти наиболее подходящего исполнителя?
                                </TaskAssigneeSuggestButton>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success"><i className="fa fa-save"/> Сохранить</button>
                                <button className="btn btn-danger ml-2" onClick={onDeleteButtonClick}><i className="fa fa-trash"/> Удалить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}