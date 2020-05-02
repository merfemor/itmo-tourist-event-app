import React from 'react';
import {userRoleToString} from "../../../utils/language_utils";
import {httpRequest} from "../../../utils/http";
import {Link} from "react-router-dom";
import {Log} from "../../../utils/Log";

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
                Log.d(TAG, "loadParticipants: server returned error, status " + response.status)
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
            <div className="col-12 mt-3">
                <Link to="/participants/new" className="btn btn-primary">Зарегистрировать участника</Link>
                <div className="table-responsive">
                    <table className="table table-sm table-bordered table-striped table-hover">
                        <thead className="thead-default">
                        <tr>
                            <th>№</th>
                            <th>email</th>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Пол</th>
                            <th>Роль</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.participants.map((participant) =>
                                <tr key={participant.id}>
                                    <td>{participant.id}</td>
                                    <td>{participant.lastName}</td>
                                    <td>{participant.email}</td>
                                    <td>{participant.firstName}</td>
                                    <td>{participant.middleName}</td>
                                    <td>{participant.isMale ? "М" : "Ж"}</td>
                                    <td> {userRoleToString(participant.role)} </td>
                                    <td>
                                        <Link to={`/participants/${participant.id}`} className="btn btn-primary">
                                            Редактировать
                                        </Link>
                                    </td>
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