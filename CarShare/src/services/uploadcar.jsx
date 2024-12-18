

    export const Uploadcar = async (formData) => {
        const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/InsertCar.php', {
            method: 'POST',
            body: formData
        });

        const text = await response.text(); // Obtener respuesta como texto
        console.log("Respuesta del servidor:", text);


        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${text}`);
        }

        const data = JSON.parse(text);
        return data;
    };

