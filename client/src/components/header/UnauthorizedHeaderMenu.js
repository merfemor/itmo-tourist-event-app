import {Link} from "react-router-dom";
import {Nav} from "reactstrap";
import React from "react";

export default function UnauthorizedHeaderMenu() {
    return (
        <Nav className="ml-auto" navbar>
            <li className="px-3 nav-item">
                <Link to="/login" className="btn btn-primary">Войти</Link>
            </li>
            <li className="px-3 nav-item">
                <Link to="/register" className="btn btn-secondary">Зарегистрироваться</Link>
            </li>
        </Nav>
    );
}