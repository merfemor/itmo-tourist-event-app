import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import {useForm} from "react-hook-form";
import {ParticipantType, RegistrationType, ResultStructure} from "../../../api/enums";
import {httpJsonRequest} from "../../../utils/http";
import {
    dateIntervalToString,
    DATETIME_RANGE_CONTAINER_LOCAL,
    momentToServerJsonVal
} from "../../../utils/language_utils";
import moment from "moment";

function getDefaultStartDateTimeForContest() {
    return moment(Date.now())
}

function getDefaultEndDateTimeForContest() {
    return moment(Date.now()).add(2, "hours")
}


export default function ContestCreate() {
    const history = useHistory();
    const {register, handleSubmit, errors} = useForm();
    const [state, setState] = useState({
        startDateTime: getDefaultStartDateTimeForContest(),
        endDateTime: getDefaultEndDateTimeForContest(),
        neverChanged: true
    });

    function onFormSubmit(formData) {
        const data = {
            ...formData,
            startDateTime: momentToServerJsonVal(state.startDateTime),
            endDateTime: momentToServerJsonVal(state.endDateTime)
        }
        httpJsonRequest("POST", "contest", data)
            .then(history.goBack);
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

    function onDateTimesChange(newStartDateTime, newEndDateTime) {
        setState({
            startDateTime: newStartDateTime,
            endDateTime: newEndDateTime,
            isSet: false
        })
    }

    return (
        <div className="row">
            <div className="col-md-8 col-xs-12 mx-auto">
                <div className="card">
                    <div className="card-header"><strong>Создать новую дистанцию</strong></div>
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
                                    <label htmlFor="start-date-time-input" className="form-control-label">Дата и время
                                        проведения</label>
                                    <input type="text" id="start-date-time-input" className="form-control"
                                           required={true}
                                           value={state.neverChanged ? "" :  dateIntervalToString(state.startDateTime, state.endDateTime)}
                                           placeholder="Выберите дату и время проведения"
                                    />
                                </div>
                            </DateTimeRangeContainer>
                            <div className="form-group">
                                <label htmlFor="result-structure-input" className="form-control-label">Структура
                                    результата</label>
                                <select id="result-structure-select" defaultValue=""
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
                                <select id="participant-type-select" defaultValue=""
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
                                <select id="registration-structure-select" defaultValue=""
                                        className={"form-control" + (errors.registrationType ? " is-invalid" : "")}
                                        name="registrationType" ref={register({
                                    required: true
                                })}>
                                    <option value="">Выберите тип регистрации</option>
                                    {generateEnumOptions(RegistrationType)}
                                </select>
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