import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";
import {httpJsonRequest} from "../../../utils/http";

export default function TaskCreate() {
    const {register, handleSubmit, errors} = useForm();
    const [isRedirect, setRedirect] = useState(false);

    if (isRedirect) {
        return <Redirect to="/tasks"/>
    }

    function onFormSubmit(formData) {
        httpJsonRequest("POST", "task", formData)
            .then(() => setRedirect(true));
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
                            { /* TODO: add assignee and associated contest */}
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
                                <input type="text" id="end-date-input" placeholder="Введите дату и время окончания"
                                       className={"form-control" + (errors.endDateTime ? " is-invalid" : "")}
                                       name="endDateTime"
                                       ref={register({
                                           required: true
                                       })}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}