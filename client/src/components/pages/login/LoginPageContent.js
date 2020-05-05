import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useAuth} from "../../../auth/AuthStateHolder";

function LoginForm(props) {
    const {register, handleSubmit, errors} = useForm();

    const renderServerValidationError = () => (
        <div className="form-group">
            <div className="alert alert-danger">Неверный email или пароль</div>
        </div>
    );

    return (
        <div className="row">
            <div className="col col-md-6 mx-auto">
                <div className="card p-4">
                    <div className="card-body card-block">
                        <h1>Войти</h1>
                        <p className="text-muted">Войти в свою учетную запись</p>
                        <form onSubmit={handleSubmit(props.onSubmitLogin)}>
                            <div className="input-group mb-3">
                                <div className="input-group-addon"><i className="fa fa-user"/></div>
                                <input type="email" id="email-input" placeholder="Введите email"
                                       className={"form-control" + (errors.email ? " is-invalid" : "")}
                                       name="email"
                                       ref={register({required: true})}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-addon"><i className="fa fa-lock"/></div>
                                <input type="password" id="password-input-main" placeholder="Введите пароль"
                                       className={"form-control" + (errors.password ? " is-invalid" : "")}
                                       name="password"
                                       ref={register({required: true})}
                                />
                            </div>
                            {props.serverSideValidationError && renderServerValidationError()}
                            <div className="row">
                                <div className="col-6">
                                    <button type="submit" className="btn btn-primary px-4">Войти</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPageContent() {
    const {loginWithEmailAndPassword} = useAuth();
    const [performRedirect, setPerformRedirect] = useState(false);
    const [serverSideValidationError, setServerSideValidationError] = useState(false);

    const onSubmitLogin = (formData) => {
        setServerSideValidationError(false);
        loginWithEmailAndPassword(formData)
            .then(() => setPerformRedirect(true))
            .catch(() => setServerSideValidationError(true));
    }
    if (performRedirect) {
        return <Redirect to="/contests"/>;
    }
    return <LoginForm onSubmitLogin={onSubmitLogin}
                      serverSideValidationError={serverSideValidationError}/>;
}