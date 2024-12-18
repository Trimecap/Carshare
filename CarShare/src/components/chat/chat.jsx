import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './chat.css'
import io from "socket.io-client";


const socket = io("http://152.228.163.56:3000");

export function Chat() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const conversationIdFromQuery = queryParams.get("conversationId");

    const getSessionToken = () => {
        const sessionCookie = document.cookie;
        const tokenValue = sessionCookie.split('; ').find(row => row.startsWith('token='));
        return tokenValue ? tokenValue.split('=')[1] : null;
    };

    useEffect(() => {
        const token = getSessionToken();
        if (!token || !conversationIdFromQuery) {
            console.error('No se encontró el token de sesión o el ID de conversación');
            return;
        }

        setConversationId(conversationIdFromQuery);


        socket.emit("joinChat", {
            conversationId: conversationIdFromQuery,
            token
        });


        socket.on("loadMessages", (loadedMessages) => {
            console.log("Mensajes históricos recibidos desde el servidor:", loadedMessages);
            setMessages(loadedMessages);
        });


        socket.on("receiveMessage", (message) => {
            console.log("Mensaje en tiempo real recibido:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });


        socket.on("error", (error) => {
            console.error(error.message);
        });


        return () => {
            socket.emit("leaveChat", { conversationId: conversationIdFromQuery });
            socket.off("receiveMessage");
            socket.off("loadMessages");
            socket.off("error");
        };
    }, [conversationIdFromQuery]);


    const sendMessage = () => {
        if (newMessage.trim()) {
            const token = getSessionToken();
            if (!token || !conversationId) {
                console.error("No se encontró el token o el ID de conversación al enviar el mensaje.");
                return;
            }


            socket.emit("sendMessage", {
                conversationId,
                token,
                message: newMessage
            });

            setNewMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${msg.fromMe ? "my-message" : "other-message"}`}
                    >
                        <span className="message-sender">{msg.fromMe ? "Tú" : "Contacto"}</span>
                        <p className="message-text">{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
}
