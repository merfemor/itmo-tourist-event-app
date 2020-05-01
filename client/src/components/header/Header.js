import React from 'react';
import {Link} from "react-router-dom";

function Header() {
    return (
        <header className="app-header navbar">
            <ul className="d-md-down-none navbar-nav">
                <li className="px-3 nav-item">
                    <Link to="/participants" className="nav-link">Participants</Link>
                </li>
                <li className="px-3 nav-item">
                    <Link to="/contests" className="nav-link">Contests</Link>
                </li>
                <li className="px-3 nav-item">
                    <Link to="/settings" className="nav-link">Settings</Link>
                </li>
            </ul>
        </header>
    )
}

export default Header;
