<?php

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
ini_set('display_errors', 0); // Desactiva la visualización de errores
ini_set('log_errors', 1); // Habilita el registro de errores
error_reporting(E_ALL); // Asegúrate de seguir capturando errores


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include '../Clases/PostLike.php';
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($data['id'], $data['token'])) {
    $result = PostLike::DeleteLike($data['id'], $data['token']);
    echo json_encode($result);
    exit; // Asegúrate de salir después de enviar la respuesta
} else {
    // Manejo de errores en caso de que no se reciba el método o los datos necesarios
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido o datos faltantes.']);
    exit;
}