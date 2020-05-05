import React from "react";
import {useAuth} from "../../auth/AuthStateHolder";
import {Link} from "react-router-dom";

export default function AuthorizedHeaderMenu() {
    const {logout} = useAuth();

    return (
        <ul className="ml-auto navbar-nav">
            <li className="nav-item">
                <Link className="btn btn-outline-secondary" to="/settings">
                    <i className="fa fa-wrench"/><span className="d-sm-down-none"> Настройки</span>
                </Link>
            </li>
            <li className="px-1 nav-item">
                <button className="btn btn-outline-danger" onClick={logout}>
                    <i className="fa fa-sign-out"/><span className="d-sm-down-none"> Выйти</span>
                </button>
            </li>
        </ul>
    );
}