import React from "react";
import {useForm} from 'react-hook-form';
import {UserRole} from "../../../api/enums";
import {BACKEND_ROOT_PATH} from "../../../utils/constants";
import {Redirect} from "react-router-dom";

const onSubmitRegistration = (formData) => {
    const person = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        isMale: formData.isMale,
        role: UserRole.PARTICIPANT.name,
        password: formData.password
    }
    postNewPerson(person)
        .then(response => {
            // TODO: store cookies, and etc
        })
}

async function postNewPerson(person) {
    const response = await fetch(BACKEND_ROOT_PATH + "/person", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(person)
    })
    return response.json();
}

function RegisterPageForm(props) {
    const {register, handleSubmit, errors, getValues } = useForm();
    const propsRequestFinishCallback = props.onRegisterFinish;
    const formDataSubmitCallback = (data) => {
        onSubmitRegistration(data);
        if (propsRequestFinishCallback) {
            propsRequestFinishCallback.call();
        }
    }
    return (
        <div className="row">
            <div className="col-md-8 col-xs-12 mx-auto">
                <div className="card">
                    <div className="card-header"><strong>Регистрация участника</strong></div>
                    <div className="card-body card-block">
                        <form onSubmit={handleSubmit(formDataSubmitCallback)}>
                            <div className="form-group">
                                <label htmlFor="email-input" className="form-control-label">Email</label>
                                <input type="email" id="email-input" placeholder="Введите email"
                                       className={ "form-control" + (errors.email ? " is-invalid" : "")}
                                       name="email"
                                       ref={register({
                                           required: true
                                       })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="first-name-input" className="form-control-label">Имя</label>
                                <input type="text" id="first-name-input" placeholder="Введите имя"
                                       className={ "form-control" + (errors.firstName ? " is-invalid" : "")}
                                       name="firstName" ref={register({
                                    required: true
                                })}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="last-name-input" className="form-control-label">Фамилия</label>
                                <input type="text" id="last-name-input" placeholder="Введите фамилию"
                                       className={ "form-control" + (errors.lastName ? " is-invalid" : "")}
                                       name="lastName"
                                       ref={register({
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
                                        className={ "form-control" + (errors.isMale ? " is-invalid" : "")}
                                        name="isMale" ref={register({
                                    required: true
                                })}>
                                    <option value="">Выберите пол</option>
                                    <option value="true">Мужской</option>
                                    <option value="false">Женский</option>
                                </select>
                            </div>

                            {  /* TODO: add birthday date chooser */ }
                            <div className="form-group">
                                <label htmlFor="password-input-main" className="form-control-label">Пароль</label>
                                <input type="password" id="password-input-main" placeholder="Введите пароль"
                                       className={ "form-control" + (errors.password ? " is-invalid" : "")}
                                       name="password"
                                       ref={register({
                                           required: true,
                                           minLength: 8
                                       })}
                                />
                                <small className="form-text text-muted">Минимальная длина пароля - 8 символов</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password-input-repeat" className="form-control-label">
                                    Повторите пароль
                                </label>
                                <input type="password" id="password-input-repeat" placeholder="Повторите пароль"
                                       className={ "form-control" + (errors.passwordRepeat ? " is-invalid" : "")}
                                       name="passwordRepeat"
                                       ref={register({
                                           validate: passwordRepeat => getValues().password === passwordRepeat
                                       })}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default class RegisterPageContent extends React.Component {
    state = {
        performRedirect: false
    }

    onRegisterFinish = () => {
        this.setState({
            performRedirect: true
        })
    }

    render() {
        if (this.state.performRedirect) {
            return <Redirect to="/contests"/>
        }
        return <RegisterPageForm onRegisterFinish={this.onRegisterFinish}/>
    }
}
