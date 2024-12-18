const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "ahzx";

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        return null;
    }
}

async function initDatabase() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'karim',
        password: 'TELECINCo2!',
        database: 'CARSHARING'
    });
    return db;
}

async function startServer() {
    const db = await initDatabase(); // Inicia la conexión a la base de datos

    // Endpoint para obtener las conversaciones del usuario autenticado
    app.get('/api/conversations', async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const user = verifyToken(token);
        if (!user) {
            return res.status(403).json({ error: 'Token inválido' });
        }

        try {
            const userId = user.sub;

            // Consultar las conversaciones del usuario
            const [conversations] = await db.execute(
                `SELECT * FROM conversations WHERE user_contacting_id = ? OR user_advertiser_id = ?`,
                [userId, userId]
            );

            // Obtener datos adicionales para cada conversación
            const conversationData = await Promise.all(conversations.map(async (conversation) => {
                // Obtener el usuario que creó el anuncio
                const [userAdvertiser] = await db.execute(
                    `SELECT username FROM users WHERE id = ?`,
                    [conversation.user_advertiser_id]
                );

                // Obtener información del anuncio (car_listing)
                const [carListing] = await db.execute(
                    `SELECT make_id, model_id, images FROM car_listings WHERE id = ?`,
                    [conversation.ad_id]
                );

                // Obtener el nombre de la marca
                const [make] = await db.execute(
                    `SELECT make_name FROM makes WHERE id = ?`,
                    [carListing[0].make_id]
                );

                // Obtener el nombre del modelo
                const [model] = await db.execute(
                    `SELECT model_name FROM models WHERE id = ?`,
                    [carListing[0].model_id]
                );

                const [last_message] = await db.execute(
                    `SELECT message FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1`,
                    [conversation.id]
                );

                // Codificar solo los espacios en la URL
                const images = carListing[0].images.map(image => {
                    return image.replace(/ /g, '%20'); // Reemplazar los espacios por '%20'
                });

                return {
                    ...conversation,
                    username: userAdvertiser[0].username,
                    images: images,
                    make_name: make[0].make_name,
                    model_name: model[0].model_name,
                    last_message: last_message[0].message
                };
            }));

            res.json(conversationData);
        } catch (error) {
            console.error('Error al obtener conversaciones:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });






    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);

        // Evento para unirse a la conversación y cargar mensajes históricos
        socket.on("joinChat", async ({ conversationId, token }) => {
            const user = verifyToken(token);
            if (!user) {
                console.log("Token inválido");
                socket.emit("error", { message: "Token inválido. No puedes unirte al chat." });
                socket.disconnect();
                return;
            }

            try {

                const [messages] = await db.execute(
                    `SELECT message, user_id FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
                    [conversationId]
                );

                const formattedMessages = messages.map(msg => ({
                    text: msg.message,
                    fromMe: msg.user_id == user.sub  // Marca como propio si el user_id coincide con el usuario actual
                }));

                // Emitir evento para cargar mensajes
                socket.emit("loadMessages", formattedMessages);
                socket.join(conversationId);
            } catch (error) {
                console.error("Error al cargar mensajes:", error.message);
                socket.emit("error", { message: "Error al cargar mensajes." });
            }
        });


        socket.on("sendMessage", async (data) => {
            const user = verifyToken(data.token);
            if (user) {
                const { message } = data;
                const conversationId = data.conversationId;

                // Guardar mensaje en la base de datos
                await db.execute(
                    `INSERT INTO messages (conversation_id, user_id, message, created_at) VALUES (?, ?, ?, NOW())`,
                    [conversationId, user.sub, message]
                );

                // Emitir mensaje a los usuarios en la conversación, marcando si es propio
                io.to(conversationId).emit("receiveMessage", { text: message, fromMe: true });
            } else {
                console.log("Token inválido en sendMessage");
                socket.emit("error", { message: "Token inválido. No puedes enviar mensajes." });
            }
        });


        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.id);
        });
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error("Error al iniciar el servidor:", err);
});
