export const DeleteLike = async ({ id, token }) => {
    const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/DeleteLike.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, token }),
    });


    const responseText = await response.text();
    console.log('Respuesta del servidor:', responseText); // Muestra la respuesta completa

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }


    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error al parsear la respuesta JSON:", error);
        throw new Error("Error de formato en la respuesta del servidor.");
    }
};
