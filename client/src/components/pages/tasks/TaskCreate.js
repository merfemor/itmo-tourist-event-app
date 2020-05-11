import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useHistory} from 'react-router-dom';
import {httpJsonRequest} from "../../../utils/http";
import PersonSearchDropdownInput from "../../forms/PersonSearchDropdownInput";
import {TaskAssigneeSuggestButton} from "./TaskAssigneeSuggestButton";
import {dateIntervalToString, DATETIME_RANGE_CONTAINER_LOCAL} from "../../../utils/language_utils";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import moment from "moment";

export function getDefaultStartDateTimeForTask(associatedContest) {
    // TODO: default task start time based on associated contest start time
    return moment(Date.now())
}

export function getDefaultEndDateTimeForTask() {
    return moment(Date.now()).add(2, "hours")
}

export default function TaskCreate(props) {
    const associatedContestId = props.associatedContestId;
    const history = useHistory();
    const {register, handleSubmit, errors, getValues} = useForm();
    const [assignee, setAssignee] = useState(null);
    const [state, setState] = useState({
        startDateTime: getDefaultStartDateTimeForTask(),
        endDateTime: getDefaultEndDateTimeForTask(),
        isSet: false
    });

    function onFormSubmit(formData) {
        const data = {
            ...formData,
            assigneeId: assignee?.id,
            associatedContestId: associatedContestId
        }
        if (state.isSet === true) {
            data.startDateTime = state.startDateTime
            data.endDateTime = state.endDateTime
        }
        httpJsonRequest("POST", "task", data)
            .then(() => history.goBack());
    }

    function onAssigneeSuggestResult(newAssignee) {
        if (newAssignee != null) {
            setAssignee(newAssignee)
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
                    <div className="card-header"><strong>Создать задачу</strong></div>
                    <div className="card-body card-block">
                        <form
                            onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="form-group">
                                <label htmlFor="name-input" className="form-control-label">Название</label>
                                <input type="text" id="name-input" placeholder="Введите название"
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
                                                               value={assignee}
                                                               onChange={setAssignee}
                                                               placeholderText="Начните вводить имя"

                                    />
                                </div>
                                <TaskAssigneeSuggestButton
                                    className="btn-link"
                                    disabled={assignee != null}
                                    data={getValues}
                                    onResult={onAssigneeSuggestResult}>
                                    Найти наиболее подходящего исполнителя?
                                </TaskAssigneeSuggestButton>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success"><i className="fa fa-plus"/> Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}