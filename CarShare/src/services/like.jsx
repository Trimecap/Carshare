export const Like = async (credentials) => {
    console.log(credentials)
    try {
        const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/Like.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en la solicitud');
        }
        return response.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};