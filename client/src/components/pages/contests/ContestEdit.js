import React, {useEffect, useState} from "react";
import {Redirect, useRouteMatch} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ParticipantType, RegistrationType, ResultStructure} from "../../../api/enums";
import {Log} from "../../../utils/Log";
import {httpRequest} from "../../../utils/http";

const TAG = "ContestEdit";

function submitContest(contestFormData) {
    Log.d(TAG, "submitContest: start");
    return httpRequest("PUT", "contest", contestFormData)
        .then(response => {
        if (response.status === 200) {
            Log.d(TAG, "submitContest: ok response, returning");
            return response.json()
        }
        Log.d(TAG, "submitContest: server returned error, status = " + response.status);
        return Promise.reject()
    })
}

function loadContestById(id) {
    Log.d(TAG, "loadContestById: " + id)
    return httpRequest("GET", "contest/" + id)
        .then(response => {
            if (response.status === 200) {
                Log.d(TAG, "loadContest: success")
                return response.json()
            }
            Log.d(TAG, "loadContest: server returned error, status = " + response.status)
            return Promise.reject()
        })
}

function deleteContestById(id) {
    Log.d(TAG, "deleteContestById: " + id)
    return httpRequest("DELETE", "contest/" + id)
        .then(response => {
            if (response.status === 200) {
                Log.d(TAG, "loadContest: success")
                return;
            }
            Log.d(TAG, "loadContest: server returned error, status = " + response.status)
            return Promise.reject()
        })
}

export default function ContestEdit() {
    const { params } = useRouteMatch();
    const {register, handleSubmit, errors} = useForm();
    const [isRedirect, setRedirect] = useState(false);
    const [contest, setContest] = useState(null);

    useEffect(() => {
        if (!isRedirect) {
            loadContestById(params.contestId)
                .then(response => setContest(response))
        }
    }, []);

    if (isRedirect) {
        return <Redirect to="/contest"/>
    }

    if (contest == null) {
        return <div/>
    }

    function onFormSubmit(formData) {
        formData['id'] = params.contestId;
        submitContest(formData)
            .then(() => setRedirect(true));
    }

    function onDeleteButtonClick(e) {
        e.preventDefault()
        deleteContestById(contest.id)
            .then(() => setRedirect(true))
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
                            { /* TODO: replace with beautiful date time pickers */}
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
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                                <button className="btn btn-danger" onClick={onDeleteButtonClick}>Удалить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}