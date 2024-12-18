<?php



$url = "http://localhost/proyecto/BackEnd/ApiRest/Filters.php";


$ch = curl_init();

// Configura cURL
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Para devolver el resultado como string

// Ejecuta la solicitud cURL
$response = curl_exec($ch);

// Verifica si hubo algún error
if ($response === false) {
    echo 'Error en la solicitud: ' . curl_error($ch);
} else {
    // Imprime la respuesta
    echo "Respuesta del servidor:\n";
    echo $response;
}

// Cierra la sesión cURL
curl_close($ch);