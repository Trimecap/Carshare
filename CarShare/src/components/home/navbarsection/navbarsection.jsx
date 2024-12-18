import React, { useState, useEffect } from 'react';
import { DesktopNavbar } from '../desktopnavbar/desktopnavbar.jsx';
import { Mobilenavbar } from '../mobilenavbar/mobilenavbar.jsx';
import {Outlet} from "react-router-dom";

export function Navbarsection() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {isMobile ? <Mobilenavbar /> : <DesktopNavbar />}
            <Outlet />
        </>
    );
}
