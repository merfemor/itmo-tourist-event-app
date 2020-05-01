import React from "react";

class RegisterPageContent extends React.Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">Регистрация участника</div>
                <div className="card-body card-block">
                    <form>
                        <div className="form-group">
                            <label htmlFor="email-input" className="form-control-label">Email</label>
                            <input type="email" id="email-input" placeholder="Введите email"
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="first-name-input" className="form-control-label">Имя</label>
                            <input type="text" id="first-name-input" placeholder="Введите имя"
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="last-name-input" className="form-control-label">Фамилия</label>
                            <input type="text" id="last-name-input" placeholder="Введите фамилию" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle-name-input" className="form-control-label">Отчество</label>
                            <input type="text" id="middle-name-input" placeholder="Введите отчество" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle-name-input" className="form-control-label">Пол</label>
                            <select id="is-male-select" className="form-control">
                                <option>Выберите пол</option>
                                <option value="true">Мужской</option>
                                <option value="false">Женский</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-input-main" className="form-control-label">Пароль</label>
                            <input type="password" id="password-input-main" placeholder="Введите пароль"
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-input-repeat" className="form-control-label">Повторите пароль</label>
                            <input type="password" id="password-input-repeat" placeholder="Повторите пароль"
                                   className="form-control"/>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary">Зарегистрироваться</button>
                </div>
            </div>
        );
    }
}

export default RegisterPageContent;