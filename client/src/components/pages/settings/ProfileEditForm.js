import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {useAuth} from "../../../auth/AuthStateHolder";
import {httpJsonRequest} from "../../../utils/http";
import {AcademicDegree, findEnumByName, SportsCategory, UserRole} from "../../../api/enums";
import {EnumSelect} from "../../forms/EnumSelect";

export default function ProfileEditForm() {
    const {authInfo, setUserInfo} = useAuth();
    const {register, handleSubmit, errors} = useForm();
    const [state, setState] = useState({
        isError: false,
        isSuccess: false
    });

    const userData = authInfo.user;

    const formDataSubmitCallback = (formData) => {
        let newRole;
        if (userData.role === UserRole.ORGANIZER.name) {
            newRole = UserRole.ORGANIZER.name;
        } else if (formData.wantToBeVolunteer) {
            newRole = UserRole.VOLUNTEER.name
        } else {
            newRole = UserRole.PARTICIPANT.name
        }
        formData.wantToBeVolunteer = undefined
        const requestData = {
            ...userData,
            ...formData,
            email: userData.email,
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
                               defaultValue={userData.email}
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
                               defaultValue={userData.lastName}
                               className={"form-control" + (errors.lastName ? " is-invalid" : "")}
                               name="lastName"
                               ref={register({
                                   required: true
                               })}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="first-name-input" className="form-control-label">Имя</label>
                        <input type="text" id="first-name-input" placeholder="Введите имя"
                               defaultValue={userData.firstName}
                               className={"form-control" + (errors.firstName ? " is-invalid" : "")}
                               name="firstName" ref={register({
                            required: true
                        })}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="middle-name-input" className="form-control-label">Отчество</label>
                        <input type="text" id="middle-name-input" placeholder="Введите отчество"
                               defaultValue={userData.middleName}
                               className="form-control" name="middleName" ref={register}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization-input" className="form-control-label">Организация или университет</label>
                        <input type="text" id="organization-input" placeholder="Введите организацию или университет"
                               defaultValue={userData.organization}
                               className="form-control" name="organization" ref={register}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization-input" className="form-control-label">Факультет ИТМО</label>
                        <input type="text" id="itmo-department-input" placeholder="Введите факультет ИТМО"
                               defaultValue={userData.itmoDepartment}
                               className="form-control" name="itmoDepartment" ref={register}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itmo-edu-group-input" className="form-control-label">Учебная группа ИТМО</label>
                        <input type="text" id="itmo-edu-group-input" placeholder="Введите учебную группу ИТМО"
                               defaultValue={userData.itmoEducationGroup}
                               className="form-control" name="itmoEducationGroup" ref={register}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itmo-isu-num-input" className="form-control-label">Номер в ИСУ</label>
                        <input type="number" id="itmo-isu-num-input" placeholder="Введите в формате 123456"
                               defaultValue={userData.itmoIsuNumber}
                               className="form-control" name="itmoIsuNumber" ref={register}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="studying-academic-degree-select" className="form-control-label">Ученая степень</label>
                        <EnumSelect enumClass={AcademicDegree}
                                    defaultValue={findEnumByName(AcademicDegree, userData.studyingAcademicDegree)}
                                    nullable={true}
                                    className="form-control"
                                    name="studyingAcademicDegree"
                                    id="studying-academic-degree-select"
                                    nullText="-"
                                    reference={register}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tourism-sports-category-select" className="form-control-label">Разряд по спортивному туризму</label>
                        <EnumSelect enumClass={SportsCategory}
                                    defaultValue={findEnumByName(SportsCategory, userData.tourismSportsCategory)}
                                    nullable={true}
                                    className="form-control"
                                    name="tourismSportsCategory"
                                    id="tourism-sports-category-select"
                                    nullText="-"
                                    reference={register}
                        />
                    </div>
                    {userData.role !== UserRole.ORGANIZER.name &&
                    <div className="form-group">
                        <label htmlFor="volunteer-checkbox" className="form-check-label">
                            <input type="checkbox" id="volunteer-checkbox" name="wantToBeVolunteer"
                                   defaultChecked={userData.role === UserRole.VOLUNTEER.name}
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
                                defaultValue={userData.isMale}
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