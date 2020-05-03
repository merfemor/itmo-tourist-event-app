import React, {useEffect, useState} from "react";
import {Redirect, useRouteMatch} from "react-router-dom";
import {useForm} from "react-hook-form";
import {httpJsonRequest, httpTextRequest} from "../../../utils/http";
import PersonSearchDropdownInput from "../../forms/PersonSearchDropdownInput";

export default function TaskEdit() {
    const { params } = useRouteMatch();
    const {register, handleSubmit, errors} = useForm();
    const [isRedirect, setRedirect] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!isRedirect) {
            httpJsonRequest("GET", `task/${params.taskId}`)
                .then(response => setData(response))
        }
    }, []);

    if (isRedirect) {
        return <Redirect to="/tasks"/>
    }

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
        console.log(newData)
        httpJsonRequest("PUT", "task", newData)
            .then(() => setRedirect(true));
    }

    function onDeleteButtonClick() {
        httpTextRequest("DELETE", `task/${params.taskId}`)
            .then(() => setRedirect(true))
    }

    function onAssigneeChange(newAssignee) {
        setData((oldData) => ({...oldData, assignee: newAssignee}))
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
                            <div className="form-group">
                                <label htmlFor="start-date-input" className="form-control-label">Дата и время
                                    начала</label>
                                <input type="text" id="start-date-input" placeholder="Введите дату и время начала"
                                       defaultValue={data.startDateTime}
                                       className="form-control" name="startDateTime" ref={register}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="end-date-input" className="form-control-label">Дата и время
                                    окончания</label>
                                <input type="text" id="end-date-input" placeholder="Введите дату и время окончания"
                                       defaultValue={data.endDateTime}
                                       className="form-control" name="endDateTime" ref={register}/>
                            </div>
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