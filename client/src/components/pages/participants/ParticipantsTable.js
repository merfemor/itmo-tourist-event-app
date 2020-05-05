import React from 'react';
import {personFullName, userRoleToString} from "../../../utils/language_utils";
import {httpRequest} from "../../../utils/http";
import {Link} from "react-router-dom";
import {Log} from "../../../utils/Log";
import {UserRole} from "../../../api/enums";
import {If} from "../../../utils/components";

const TAG = "ParticipantTable";

export default class ParticipantsTable extends React.Component {
    state = {
        participants: null
    }

    componentDidMount() {
        Log.d(TAG, "loadParticipants: start")
        httpRequest("GET", "person")
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                // TODO: handle HTTP errors
                return Promise.reject()
            })
            .then(data => {
                this.setState({
                    participants: data
                })
            })
    }

    render() {
        if (this.state.participants == null) {
            // TODO: add spinner on the page
            return <div/>
        }

        return (
            <div className="col-12">
                <If roleAtLeast={UserRole.VOLUNTEER}>
                    <Link to="/participants/new" className="btn btn-success mb-2">
                        <i className="fa fa-plus"/> Зарегистрировать участника
                    </Link>
                </If>
                <div className="">
                    <table className="table bg-white table-sm table-striped table-hover">
                        <thead className="thead-default">
                        <tr>
                            <th>№</th>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Пол</th>
                            <th>Роль</th>
                            <If roleAtLeast={UserRole.VOLUNTEER}>
                                <th><span className="d-sm-down-none">Действия</span></th>
                            </If>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.participants.map((participant) =>
                                <tr key={participant.id}>
                                    <td>{participant.id}</td>
                                    <td>{personFullName(participant)}</td>
                                    <td>{participant.email}</td>
                                    <td>{participant.isMale ? "М" : "Ж"}</td>
                                    <td> {userRoleToString(participant.role)} </td>
                                    <If roleAtLeast={UserRole.VOLUNTEER}>
                                        <td>
                                            <Link to={`/participants/${participant.id}`} className="btn btn-sm btn-link">
                                                <i className="fa fa-edit"/>
                                                <span className="d-sm-down-none"> Редактировать</span>

                                            </Link>
                                        </td>
                                    </If>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}