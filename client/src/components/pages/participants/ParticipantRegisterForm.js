import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {registerParticipant} from "../../../api/requests/person";
import {Redirect} from "react-router-dom";
import {AcademicDegree, SportsCategory, UserRole} from "../../../api/enums";
import {IsMaleSelect} from "../../forms/IsMaleSelect";
import {EnumSelect} from "../../forms/EnumSelect";

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
                            <IsMaleSelect id="is-male-select"
                                          className={"form-control" + (errors.isMale ? " is-invalid" : "")}
                                          name="isMale" reference={register({required: true})}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="organization-input" className="form-control-label">Организация или университет</label>
                            <input type="text" id="organization-input" placeholder="Введите организацию или университет"
                                   className="form-control" name="organization" ref={register}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="studying-academic-degree-select" className="form-control-label">Ученая степень</label>
                            <EnumSelect enumClass={AcademicDegree}
                                        nullable={true}
                                        className="form-control"
                                        name="studyingAcademicDegree"
                                        id="studying-academic-degree-select"
                                        nullText="-"
                                        reference={register}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="organization-input" className="form-control-label">Факультет ИТМО</label>
                            <input type="text" id="itmo-department-input" placeholder="Введите факультет ИТМО"
                                   className="form-control" name="itmoDepartment" ref={register}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="itmo-edu-group-input" className="form-control-label">Учебная группа ИТМО</label>
                            <input type="text" id="itmo-edu-group-input" placeholder="Введите учебную группу ИТМО"
                                   className="form-control" name="itmoEducationGroup" ref={register}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="itmo-isu-num-input" className="form-control-label">Номер в ИСУ</label>
                            <input type="number" id="itmo-isu-num-input" placeholder="Введите в формате 123456"
                                   className="form-control" name="itmoIsuNumber" ref={register}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tourism-sports-category-select" className="form-control-label">Разряд по спортивному туризму</label>
                            <EnumSelect enumClass={SportsCategory}
                                        nullable={true}
                                        className="form-control"
                                        name="tourismSportsCategory"
                                        id="tourism-sports-category-select"
                                        nullText="-"
                                        reference={register}
                            />
                        </div>

                        {  /* TODO: add birthday date chooser */}
                        <div className="form-group">
                            <button type="submit" className="btn btn-success"> <i className="fa fa-plus"/> Зарегистрировать</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}