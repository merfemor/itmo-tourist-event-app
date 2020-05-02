import React from 'react';
import {userRoleToString} from "../../../utils/language_utils";
import {httpRequest} from "../../../utils/http";

export default class ParticipantsTable extends React.Component {
    state = {
        participants: []
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
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
            <div>
                <div className="table-responsive">
                    <table className="table-outline mb-0 d-none d-sm-table table table-hover">
                        <thead className="thead-default">
                        <tr>
                            <th>Номер участника</th>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Пол</th>
                            <th>Роль</th>
                            <th>email</th>
                            <th>raw json</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.participants.map((participant, index) =>
                                <tr>
                                    <td>{index}</td>
                                    <td>{participant.lastName}</td>
                                    <td>{participant.firstName}</td>
                                    <td>{participant.middleName}</td>
                                    <td>{participant.isMale ? "М" : "Ж"}</td>
                                    <td> {userRoleToString(participant.role)} </td>
                                    <td>{participant.email}</td>
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