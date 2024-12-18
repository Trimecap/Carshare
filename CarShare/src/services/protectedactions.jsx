
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const isAuthenticated = () => {

    return document.cookie.includes('token=');
};

export const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};
