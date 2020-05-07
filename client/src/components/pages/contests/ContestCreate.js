import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ParticipantType, RegistrationType, ResultStructure} from "../../../api/enums";
import {Log} from "../../../utils/Log";
import {httpRequest} from "../../../utils/http";

const TAG = "ContestCreate";

function submitContest(contestFormData) {
    Log.d(TAG, "submitContest: start");
    return httpRequest("POST", "contest", contestFormData)
        .then(response => {
        if (response.status === 200) {
            Log.d(TAG, "submitContest: ok response, returning");
            return Promise.resolve()
        }
        return Promise.reject()
    })
}

export default function ContestCreate() {
    const {register, handleSubmit, errors} = useForm();
    const [isRedirect, setRedirect] = useState(false);

    if (isRedirect) {
        return <Redirect to="/contests"/>
    }

    function onFormSubmit(formData) {
        submitContest(formData)
            .then(() => setRedirect(true));
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
                            { /* TODO: replace with beautiful date time pickers */}
                            <div className="form-group">
                                <label htmlFor="start-date-input" className="form-control-label">Дата и время
                                    начала</label>
                                <input type="text" id="start-date-input" placeholder="Введите дату и время начала"
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