import React from 'react';
import {Link} from "react-router-dom";
import {Nav, NavbarBrand, NavbarToggler} from 'reactstrap';
import {useAuth} from "../../auth/AuthStateHolder";
import AuthorizedHeaderMenu from "./AuthorizedHeaderMenu";
import UnauthorizedHeaderMenu from "./UnauthorizedHeaderMenu";
import {If} from "../../utils/components";
import {UserRole} from "../../api/enums";

function mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
}

function sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
}

export default function Header() {
    const {authInfo} = useAuth();

    return (
        <header className="app-header navbar">
            <NavbarToggler className="d-lg-none" onClick={mobileSidebarToggle}>&#9776;</NavbarToggler>
            <div className="navbar-brand">
                <div className="mt-1">Турслёт ИТМО</div>
            </div>
            <NavbarToggler className="d-md-down-none" onClick={sidebarToggle}>&#9776;</NavbarToggler>
            <Nav className="d-md-down-none" navbar>
                <li className="px-3 nav-item">
                    <Link to="/contests" className="nav-link"><i className="fa fa-calendar mr-1"/> Дистанции</Link>
                </li>
                <If roleAtLeast={UserRole.PARTICIPANT}>
                    <li className="px-3 nav-item">
                        <Link to="/participants" className="nav-link"><i className="fa fa-users mr-1"/> Участники</Link>
                    </li>
                </If>
            </Nav>
            {authInfo?.user ? <AuthorizedHeaderMenu/> : <UnauthorizedHeaderMenu/>}
        </header>
    );
}
