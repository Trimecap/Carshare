import React, { useState } from 'react';
import './startuser.css';
import {signup} from "../../services/signup.jsx";
import {login} from "../../services/login.jsx";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


export function Startuser() {
    const [isSignIn, setIsSignIn] = useState(true);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsSignIn(!isSignIn);
    };

    const [userName, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignUp = async (e) =>{
        e.preventDefault();
        const insertuser = await signup({userName, fullName, email, password});
        setMessage(insertuser);
        setUsername('');
        setFullName('');
        setEmail('');
        setPassword('');
    }

    const handleLogIn = async (e) =>{
        e.preventDefault();
        const logintoken = await login({email, password});
        if (logintoken && logintoken.token) {
            Cookies.set('token', logintoken.token, { expires: 30 });
            navigate('/');
        }
        setMessage(logintoken);
        setEmail('');
        setPassword('');
    }

    return (
        <div className="formcontainer">
            <div className={`containeruser ${isSignIn ? '' : 'active'}`}>
                <div className="form-container sign-up">
                    <form onSubmit={handleSignUp}>
                        <h1>Crear Cuenta</h1>
                        <input type="text" value={userName} name="username" placeholder="Usuario" required onChange={(e) => setUsername(e.target.value)} />
                        <input type="text" value={fullName} name="fullName" placeholder="Nombre completo" required onChange={(e) => setFullName(e.target.value)} />
                        <input type="email" value={email} name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" value={password} name="password" placeholder="Contraseña" required onChange={(e) => setPassword(e.target.value)} />
                        <button>Crear Cuenta</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={handleLogIn}>
                        <h1>Iniciar Sesión</h1>
                        <input type="email" value={email} name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" value={password} name="password" placeholder="Contraseña" required onChange={(e) => setPassword(e.target.value)} />
                        <button>Iniciar Sesión</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className={`toggle-panel toggle-left ${isSignIn ? 'active' : ''}`}>
                            <h1>¡Bienvenido!</h1>
                            <p id="arreglo">Inserta tus datos para acceder a tu cuenta</p>
                            <button className="hidden" onClick={handleToggle}>Iniciar Sesión</button>
                        </div>
                        <div className={`toggle-panel toggle-right ${!isSignIn ? 'active' : ''}`}>
                            <h1>¡Hola!</h1>
                            <p>Registrate para poder acceder a todas las funcionalides de la app</p>
                            <button className="hidden" onClick={handleToggle}>Registrate</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
