export const login = async (credentials) => {
    try {
        const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/LogIn.php', {
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
        const token = await response.json();
        return token;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};