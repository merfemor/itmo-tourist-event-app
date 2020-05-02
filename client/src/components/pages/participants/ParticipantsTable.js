import React from 'react';
import {userRoleToString} from "../../../utils/language_utils";
import {httpRequest} from "../../../utils/http";
import {Link} from "react-router-dom";

export default class ParticipantsTable extends React.Component {
    state = {
        participants: []
    }

    componentDidMount() {
        httpRequest("GET", "person")
            .then(response => response.json())
            .then(data => {
                // TODO: handle HTTP errors
                // TODO: add spinner on the page
                this.setState({
                    participants: data
                })
            })
    }

    render() {
        return (
            <div className="col-12 mt-3">
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
                            <th>raw json</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.participants.map((participant, index) =>
                                <tr>
                                    <td>{index}</td>
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
                                    <td>{JSON.stringify(participant)} </td>
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