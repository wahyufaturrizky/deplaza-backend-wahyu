import React from 'react'
import { Link } from 'react-router-dom';

export default function Header(props) {
    return (
        /* Navbar */
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                </li>
                <Link to="/home" className="nav-link">Home</Link>
                <div style={{marginTop: 7, fontSize: 17}}>/</div>
                <li className="nav-link active">{props.name}</li>
            </ul>
        </nav>
        /* /.navbar */
    )
}
