import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useAuth} from "../../auth/AuthStateHolder";

function LoginForm(props) {
    const {register, handleSubmit, errors} = useForm();

    const renderServerValidationError = () => (
        <div className="form-group">
            <div className="alert alert-danger">Неверный email или пароль</div>
        </div>
    );

    return (
        <div className="row">
            <div className="col-md-8 col-xs-12 mx-auto">
                <div className="card">
                    <div className="card-header"><strong>Войти</strong></div>
                    <div className="card-body card-block">
                        <form onSubmit={handleSubmit(props.onSubmitLogin)}>
                            {props.serverSideValidationError && renderServerValidationError()}
                            <div className="form-group">
                                <label htmlFor="email-input" className="form-control-label">Email</label>
                                <input type="email" id="email-input" placeholder="Введите email"
                                       className={"form-control" + (errors.email ? " is-invalid" : "")}
                                       name="email"
                                       ref={register({required: true})}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password-input-main" className="form-control-label">Пароль</label>
                                <input type="password" id="password-input-main" placeholder="Введите пароль"
                                       className={"form-control" + (errors.password ? " is-invalid" : "")}
                                       name="password"
                                       ref={register({required: true})}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Войти</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPageContent() {
    const { loginWithEmailAndPassword } = useAuth();
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