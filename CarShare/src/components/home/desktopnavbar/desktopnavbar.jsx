import React from "react";
import './desktopnavbar.css';
import logo from '../../../assets/CarShare.png';
import {Link} from "react-router-dom";
export function DesktopNavbar() {
    return (
        <header className='header'>
            <Link to="/" className="logo">
                <img src={logo} alt="Logo"/>
            </Link>
            <nav className="navbar">
                <Link to="/liked">
                    <span className="icon">
                        <ion-icon name="heart"></ion-icon>
                    </span>
                    Favoritos
                </Link>
                <Link to="/message">
                    <span className="icon">
                        <ion-icon name="mail"></ion-icon>
                    </span>
                    Buzón
                </Link>
                <Link to="/profile">
                    <span className="icon">
                        <ion-icon name="person"></ion-icon>
                    </span>
                    Tú
                </Link>
                <Link to="/upload">
                    <span className="icon">
                        <ion-icon name="add-circle-outline"></ion-icon>
                    </span>
                    Subir
                </Link>
            </nav>
        </header>
    );
}
