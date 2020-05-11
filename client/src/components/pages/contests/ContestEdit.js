import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ParticipantType, RegistrationType, ResultStructure} from "../../../api/enums";
import {httpJsonRequest} from "../../../utils/http";
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import {
    dateIntervalToString,
    DATETIME_RANGE_CONTAINER_LOCAL,
    dateTimeToString,
    momentFromServerJsonVal,
    momentToServerJsonVal
} from "../../../utils/language_utils";


export default function ContestEdit() {
    const history = useHistory();
    const { params } = useRouteMatch();
    const {register, handleSubmit, errors} = useForm();
    const [contest, setContest] = useState(null);
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);


    useEffect(() => {
        httpJsonRequest("GET", "contest/" + params.contestId)
            .then(response => {
                setStartDateTime(momentFromServerJsonVal(response.startDateTime))
                setEndDateTime(momentFromServerJsonVal(response.endDateTime))
                setContest(response)
            })
    }, []);

    if (contest == null) {
        return <div/>
    }

    function onFormSubmit(formData) {
        const data = {
            ...formData,
            id: contest.id,
            startDateTime: momentToServerJsonVal(startDateTime),
            endDateTime: momentToServerJsonVal(endDateTime)
        }
        httpJsonRequest("PUT", "contest", data)
            .then(history.goBack)
    }

    function onDeleteButtonClick(e) {
        e.preventDefault()
        httpJsonRequest("DELETE", "contest/" + contest.id)
            .then(history.goBack)
    }

    function generateEnumOptions(enumClass) {
        let result = [];
        for (const item in enumClass) {
            if (enumClass.hasOwnProperty(item)) {
                const itemValue = enumClass[item]
                result.push(
                    <option key={itemValue.name} value={itemValue.name}>{itemValue.displayName}</option>
                );
            }
        }
        return result;
    }

    function onDatesChange(newStartDateTime, newEndDateTime) {
        setStartDateTime(newStartDateTime)
        setEndDateTime(newEndDateTime)
    }

    return (
        <div className="row">
            <div className="col-md-8 col-xs-12 mx-auto">
                <div className="card">
                    <div className="card-header"><strong>Редактировать дистанцию</strong></div>
                    <div className="card-body card-block">
                        <form
                            onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="form-group">
                                <label htmlFor="name-input" className="form-control-label">Название</label>
                                <input type="text" id="name-input" placeholder="Введите название"
                                       defaultValue={contest.name}
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
                                          defaultValue={contest.description}
                                          className={"form-control" + (errors.description ? " is-invalid" : "")}
                                          name="description" ref={register}/>
                            </div>
                            <DateTimeRangeContainer start={startDateTime} end={endDateTime}
                                                    local={DATETIME_RANGE_CONTAINER_LOCAL}
                                                    applyCallback={onDatesChange}>
                                <div className="form-group">
                                    <label htmlFor="start-date-time-input" className="form-control-label">Дата и время
                                        проведения</label>
                                    <input type="text" id="start-date-time-input" className="form-control"
                                           required={true}
                                           value={dateIntervalToString(startDateTime, endDateTime)}
                                    />
                                </div>
                            </DateTimeRangeContainer>
                            <div className="form-group">
                                <label htmlFor="start-date-input" className="form-control-label">Дата и время
                                    начала</label>
                                <input type="text" id="start-date-input" placeholder="Введите дату и время начала"
                                       defaultValue={contest.startDateTime}
                                       className={"form-control" + (errors.startDateTime ? " is-invalid" : "")}
                                       name="startDateTime"
                                       ref={register({
                                           required: true
                                       })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="end-date-input" className="form-control-label">Дата и время
                                    окончания</label>
                                <input type="text" id="end-date-input" placeholder="Введите название"
                                       defaultValue={contest.endDateTime}
                                       className={"form-control" + (errors.endDateTime ? " is-invalid" : "")}
                                       name="endDateTime"
                                       ref={register({
                                           required: true
                                       })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="result-structure-input" className="form-control-label">Структура
                                    результата</label>
                                <select id="result-structure-select"
                                        defaultValue={contest.resultStructure}
                                        className={"form-control" + (errors.resultStructure ? " is-invalid" : "")}
                                        name="resultStructure" ref={register({
                                    required: true
                                })}>
                                    <option value="">Выберите структуру результата</option>
                                    {generateEnumOptions(ResultStructure)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="participant-type-input" className="form-control-label">Тип
                                    участника</label>
                                <select id="participant-type-select" defaultValue={contest.participantType}
                                        className={"form-control" + (errors.participantType ? " is-invalid" : "")}
                                        name="participantType" ref={register({
                                    required: true
                                })}>
                                    <option value="">Выберите тип участника</option>
                                    {generateEnumOptions(ParticipantType)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="registration-type-input" className="form-control-label">Тип
                                    регистрации</label>
                                <select id="registration-structure-select" defaultValue={contest.registrationType}
                                        className={"form-control" + (errors.registrationType ? " is-invalid" : "")}
                                        name="registrationType" ref={register({
                                    required: true
                                })}>
                                    <option value="">Выберите тип регистрации</option>
                                    {generateEnumOptions(RegistrationType)}
                                </select>
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