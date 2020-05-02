import React from "react";
import {useAuth} from "../../auth/AuthStateHolder";
import {Nav} from "reactstrap";

export default function AuthorizedHeaderMenu() {
    const {logout} = useAuth();
    return (
        <Nav className="ml-auto" navbar>
            <li className="px-3 nav-item">
                <button className="btn btn-primary" onClick={logout}>Выйти</button>
            </li>
        </Nav>
    );
}