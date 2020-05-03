import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {registerParticipant} from "../../../api/requests/person";
import {Redirect} from "react-router-dom";
import {UserRole} from "../../../api/enums";

export default function ParticipantRegisterForm() {
    const [isRedirect, setRedirect] = useState(false);
    const {register, handleSubmit, errors} = useForm();

    if (isRedirect) {
        return <Redirect to="/participants"/>
    }

    function formDataSubmitCallback(data) {
        registerParticipant({
            ...data,
            role: UserRole.PARTICIPANT.name
        })
            .then(() => setRedirect(true))
            .catch((status) => {
                // TODO: duplicate email error handling
            })
    }

    return (
        <div className="col-md-8 col-xs-12 mx-auto">
            <div className="card">
                <div className="card-header"><strong>Регистрация участника</strong></div>
                <div className="card-body card-block">
                    <form onSubmit={handleSubmit(formDataSubmitCallback)}>
                        <div className="form-group">
                            <label htmlFor="email-input" className="form-control-label">Email</label>
                            <input type="email" id="email-input" placeholder="Введите email"
                                   className={"form-control" + (errors.email ? " is-invalid" : "")}
                                   name="email"
                                   ref={register({
                                       required: true
                                   })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last-name-input" className="form-control-label">Фамилия</label>
                            <input type="text" id="last-name-input" placeholder="Введите фамилию"
                                   className={"form-control" + (errors.lastName ? " is-invalid" : "")}
                                   name="lastName"
                                   ref={register({
                                       required: true
                                   })}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="first-name-input" className="form-control-label">Имя</label>
                            <input type="text" id="first-name-input" placeholder="Введите имя"
                                   className={"form-control" + (errors.firstName ? " is-invalid" : "")}
                                   name="firstName" ref={register({
                                required: true
                            })}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle-name-input" className="form-control-label">Отчество</label>
                            <input type="text" id="middle-name-input" placeholder="Введите отчество"
                                   className="form-control" name="middleName" ref={register}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle-name-input" className="form-control-label">Пол</label>
                            <select id="is-male-select" defaultValue=""
                                    className={"form-control" + (errors.isMale ? " is-invalid" : "")}
                                    name="isMale" ref={register({
                                required: true
                            })}>
                                <option value="">Выберите пол</option>
                                <option value="true">Мужской</option>
                                <option value="false">Женский</option>
                            </select>
                        </div>

                        {  /* TODO: add birthday date chooser */}
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Зарегистрировать</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}