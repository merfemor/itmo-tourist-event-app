import React from "react";
import {Nav} from "reactstrap";
import {Link} from "react-router-dom";
import {UserRole} from "../../api/enums";
import {If} from "../../utils/components";

class Sidebar extends React.Component {
    render() {
        return (
            <div className="sidebar">
                <nav className="sidebar-nav">
                    <Nav>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contests"><i className="fa fa-calendar"/>Дистанции</Link>
                        </li>
                        <If roleAtLeast={UserRole.PARTICIPANT}>
                            <li className="nav-item">
                                <Link className="nav-link" to="/participants"><i
                                    className="fa fa-users"/> Участники</Link>
                            </li>
                        </If>
                        <If roleAtLeast={UserRole.VOLUNTEER}>
                            <li className="nav-item">
                                <Link className="nav-link" to="/tasks"><i className="fa fa-tasks"/> Задачи</Link>
                            </li>
                        </If>
                    </Nav>
                </nav>
            </div>
        );
    }
}

export default Sidebar;