import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {useAuth} from "../../../auth/AuthStateHolder";
import {httpJsonRequest} from "../../../utils/http";
import {UserRole} from "../../../api/enums";

export default function ProfileEditForm() {
    const {authInfo, setUserInfo} = useAuth();
    const {register, handleSubmit, errors} = useForm();
    const [state, setState] = useState({
        isError: false,
        isSuccess: false
    });

    const formDataSubmitCallback = (data) => {
        let newRole;
        if (authInfo.role === UserRole.ORGANIZER.name) {
            newRole = UserRole.ORGANIZER.name;
        } else if (data.wantToBeVolunteer) {
            newRole = UserRole.VOLUNTEER.name
        } else {
            newRole = UserRole.PARTICIPANT.name
        }
        const requestData = {
            ...authInfo.user,
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            role: newRole
        };
        setState({
            isError: false,
            isSuccess: false
        })
        httpJsonRequest("PUT", "person", requestData)
            .then((person) => {
                setState({
                    isError: false,
                    isSuccess: true
                })
                setUserInfo(person)
            })
            .catch(() => {
                setState({
                    isError: true,
                    isSuccess: false
                })
            })
    }

    function renderErrorAlert() {
        return <div className="form-group">
            <div className="alert alert-danger">Не удалось</div>
        </div>
    }

    function renderSuccessAlert() {
        return <div className="form-group">
            <div className="alert alert-success">Успешно</div>
        </div>
    }

    return (
        <div className="card">
            <div className="card-header"><strong>Редактирование данных профиля</strong></div>
            <div className="card-body card-block">
                <form onSubmit={handleSubmit(formDataSubmitCallback)}>
                    {state.isError && renderErrorAlert()}
                    {state.isSuccess && renderSuccessAlert()}
                    <div className="form-group">
                        <label htmlFor="email-input" className="form-control-label">Email</label>
                        <input type="email" id="email-input" placeholder="Введите email"
                               disabled
                               defaultValue={authInfo.user.email}
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
                               defaultValue={authInfo.user.lastName}
                               className={"form-control" + (errors.lastName ? " is-invalid" : "")}
                               name="lastName"
                               ref={register({
                                   required: true
                               })}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="first-name-input" className="form-control-label">Имя</label>
                        <input type="text" id="first-name-input" placeholder="Введите имя"
                               defaultValue={authInfo.user.firstName}
                               className={"form-control" + (errors.firstName ? " is-invalid" : "")}
                               name="firstName" ref={register({
                            required: true
                        })}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="middle-name-input" className="form-control-label">Отчество</label>
                        <input type="text" id="middle-name-input" placeholder="Введите отчество"
                               defaultValue={authInfo.user.middleName}
                               className="form-control" name="middleName" ref={register}/>
                    </div>
                    {authInfo.user.role !== UserRole.ORGANIZER.name &&
                    <div className="form-group">
                        <label htmlFor="volunteer-checkbox" className="form-check-label">
                            <input type="checkbox" id="volunteer-checkbox" name="wantToBeVolunteer"
                                   defaultChecked={authInfo.user.role === UserRole.VOLUNTEER.name}
                                   className="form-check-input"
                                   ref={register}
                            />
                            Я - волонтер
                        </label>
                    </div>
                    }
                    <div className="form-group">
                        <label htmlFor="middle-name-input" className="form-control-label">Пол</label>
                        <select id="is-male-select"
                                defaultValue={authInfo.user.isMale}
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
                        <button type="submit" className="btn btn-success px-4"><i className="fa fa-save"/> Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}