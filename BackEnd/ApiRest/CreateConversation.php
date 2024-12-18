<?php
// Configuración CORS
header("Access-Control-Allow-Origin: *"); // Permite todas las fuentes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['token'])) {
    require_once '../Clases/GetUser.php';
    $result = GetUser::Conversation($input['userId'], $input['token'], $input['adId'] );
    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'No se encontraron anuncios.']);
    }
} else {
    echo json_encode(['error' => 'Falta el token en la solicitud.']);
}

