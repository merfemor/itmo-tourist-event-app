import {Link} from "react-router-dom";
import {Nav} from "reactstrap";
import React from "react";

export default function UnauthorizedHeaderMenu() {
    return (
        <ul className="ml-auto navbar-nav">
            <li className="nav-item">
                <Link to="/login" className="btn btn-outline-success"><i className="fa fa-sign-in"/>
                <span className="d-sm-down-none"> Войти</span>
                </Link>
            </li>
            <li className="nav-item px-1">
                <Link to="/register" className="btn btn-outline-primary"><i className="fa fa-user"/>
                    <span className="d-sm-down-none"> Зарегистрироваться</span></Link>
            </li>
        </ul>
    );
}