import React from "react";
import {Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";

const onSubmitLogin = (formData) => {
    console.log("Submit login")
    console.log(formData)
    // TODO: implement auth
}

function LoginForm(props) {
    const {register, handleSubmit, errors} = useForm();
    const formDataSubmitCallback = (data) => {
        onSubmitLogin(data);
        if (props.onLoginFinish) {
            props.onLoginFinish.call();
        }
    }

    return (
        <div className="row">
            <div className="col-md-8 col-xs-12 mx-auto">
                <div className="card">
                    <div className="card-header"><strong>Войти</strong></div>
                    <div className="card-body card-block">
                        <form onSubmit={handleSubmit(formDataSubmitCallback)}>
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

export default class LoginPageContent extends React.Component {
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
        return <LoginForm onLoginFinish={this.onRegisterFinish}/>
    }
}