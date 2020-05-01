import React from 'react';
import {Link} from "react-router-dom";
import {Nav, NavbarBrand, NavbarToggler} from 'reactstrap';

class Header extends React.Component {
    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }

    render() {
        return (
            <header className="app-header navbar">
                <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
                <NavbarBrand href="#"/>
                <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>&#9776;</NavbarToggler>
                <Nav className="d-md-down-none" navbar>
                    <li className="px-3 nav-item">
                        <Link to="/contests" className="nav-link">Дистанции</Link>
                    </li>
                    <li className="px-3 nav-item">
                        <Link to="/participants" className="nav-link">Участники</Link>
                    </li>
                </Nav>
                <Nav className="ml-auto" navbar>
                    <li className="px-3 nav-item">
                        <Link to="/login" className="btn btn-primary">Войти</Link>
                    </li>
                    <li className="px-3 nav-item">
                        <Link to="/register" className="btn btn-secondary">Зарегистрироваться</Link>
                    </li>
                </Nav>
            </header>
        )
    }
}

export default Header;
