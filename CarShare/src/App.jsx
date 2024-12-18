// App.jsx
import React from 'react';
import './App.css';
import { Home } from "./components/home/home.jsx";
import { Route, Routes } from "react-router-dom";
import { CarDetail } from "./components/cardetails/cardetails.jsx";
import { Startuser } from "./components/startuser/startuser.jsx";
import {Upload} from "./components/upload/upload.jsx";
import { ProtectedRoute } from "./services/protectedactions.jsx";
import { Navbarsection } from './components/home/navbarsection/navbarsection.jsx';
import {Chatlist} from "./components/chatlist/chatlist.jsx";
import { Chat } from "./components/chat/chat.jsx";
import  { Likepage } from "./components/like/likepage.jsx";
import { Profile } from "./components/profile/profile.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Startuser />} />
                <Route element={<Navbarsection />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/:id" element={<CarDetail />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/liked" element={<Likepage />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/message" element={<Chatlist/>} />
                        <Route path="/profile" element={<Profile/>} />
                        <Route path="/chat" element={<Chat />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
