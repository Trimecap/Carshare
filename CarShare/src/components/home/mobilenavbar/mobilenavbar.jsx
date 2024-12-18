import React, { useRef, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import './mobilenavbar.css';

export function Mobilenavbar() {
    const listRef = useRef([]);

    useEffect(() => {
        const handleActiveLink = (index) => {
            listRef.current.forEach((item, i) => {
                if (item) {
                    item.classList.toggle('active', i === index);
                }
            });
        };

        listRef.current.forEach((item, index) => {
            if (item) {
                item.addEventListener('click', () => handleActiveLink(index));
            }
        });

        return () => {
            listRef.current.forEach((item) => {
                if (item) {
                    item.removeEventListener('click', handleActiveLink);
                }
            });
        };
    }, []);

    return (
        <div className="container">
            <div className="navigation">
                <ul>
                    <li className="list active" ref={el => listRef.current[0] = el}>
                        <Link to='/'>
                            <span className="icon">
                                <ion-icon name="home"></ion-icon>
                            </span>
                            <span className="text">Inicio</span>
                        </Link>
                    </li>
                    <li className="list" ref={el => listRef.current[1] = el}>
                        <Link to='/liked'>
                            <span className="icon">
                                <ion-icon name="heart"></ion-icon>
                            </span>
                            <span className="text">Favoritos</span>
                        </Link>
                    </li>
                    <li className="list" ref={el => listRef.current[2] = el}>
                        <Link to='/upload'>
                            <span className="icon">
                                <ion-icon name="add-circle-outline"></ion-icon>
                            </span>
                            <span className="text">Subir</span>
                        </Link>
                    </li>
                    <li className="list" ref={el => listRef.current[3] = el}>
                        <Link to='/message'>
                            <span className="icon">
                                <ion-icon name="mail"></ion-icon>
                            </span>
                            <span className="text">Buzón</span>
                        </Link>
                    </li>
                    <li className="list" ref={el => listRef.current[4] = el}>
                        <Link to='/profile'>
                            <span className="icon">
                                <ion-icon name="contact"></ion-icon>
                            </span>
                            <span className="text">Tú</span>
                        </Link>
                    </li>
                    <div className="indicator"></div>
                </ul>
            </div>
        </div>
    );
}
