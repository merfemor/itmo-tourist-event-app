import React from "react";
import {useAuth} from "../../auth/AuthStateHolder";
import {Link} from "react-router-dom";

export default function AuthorizedHeaderMenu() {
    const {logout} = useAuth();
    return (
        <ul className="ml-auto navbar-nav">
            <li className="px-3 nav-item">
                <Link className="btn btn-secondary" to="/settings">
                    <i className="icon-settings"/>Настройки
                </Link>
            </li>
            <li className="px-3 nav-item">
                <button className="btn btn-primary" onClick={logout}>Выйти</button>
            </li>
        </ul>
    );
}