import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatList.css';

export function Chatlist() {
    const [conversations, setConversations] = useState([]);


    const fetchConversations = async () => {
        const token = getSessionToken();

        if (!token) {
            console.error("No se encontró el token de sesión.");
            return;
        }

        try {
            const response = await fetch('http://152.228.163.56:3000/api/conversations', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener las conversaciones');
            }

            const data = await response.json();
            setConversations(data);
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className="chat-list">
            <h2>Bandeja de Entrada</h2>
            <ul className="conversation-list">
                {conversations.map((conversation) => (
                    <Link
                        to={`/chat?conversationId=${conversation.id}`}
                        key={conversation.id}
                        className="conversation-item"
                    >
                        <div className="conversation-image">
                            <img
                                src={conversation.images[0] || 'default-image.png'}
                                alt="Producto"
                            />
                        </div>
                        <div className="conversation-details">
                            <div className="conversation-user">{conversation.username}</div>
                            <div className="conversation-title">
                                {`${conversation.make_name} ${conversation.model_name}`}
                            </div>
                            <div className="conversation-message">
                                {conversation.last_message || 'No hay mensajes recientes'}
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
}


const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Función para obtener el token de sesión
const getSessionToken = () => {
    const sessionCookie = document.cookie;
    const tokenValue = sessionCookie.split('; ').find(row => row.startsWith('token='));
    if (!tokenValue) {
        console.error("No se encontró la cookie de sesión 'token'");
        return null;
    }
    const actualToken = tokenValue.split('=')[1];
    return actualToken;
};
