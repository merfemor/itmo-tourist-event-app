import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";
import {httpJsonRequest} from "../../../utils/http";
import PersonSearchDropdownInput from "../../forms/PersonSearchDropdownInput";

export default function TaskCreate() {
    const {register, handleSubmit, errors} = useForm();
    const [isRedirect, setRedirect] = useState(false);
    const [assignee, setAssignee] = useState(null);

    if (isRedirect) {
        return <Redirect to="/tasks"/>
    }

    function onFormSubmit(formData) {
        httpJsonRequest("POST", "task", { ...formData, assigneeId: assignee?.id })
            .then(() => setRedirect(true));
    }

    function onAssigneeChange(newAssignee) {
        setAssignee(newAssignee)
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
                                       className="form-control" name="startDateTime" ref={register}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="end-date-input" className="form-control-label">Дата и время
                                    окончания</label>
                                <input type="text" id="end-date-input" placeholder="Введите дату и время окончания"
                                       className="form-control" name="endDateTime" ref={register}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="assignee-search-dropdown-input"
                                       className="form-control-label">
                                    Исполнитель
                                </label>
                                <div className="input-group">
                                    <PersonSearchDropdownInput id="assignee-search-dropdown-input"
                                                               onChange={onAssigneeChange}
                                                               placeholderText="Начните вводить имя"

                                    />
                                </div>
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