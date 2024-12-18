<?php
header("Access-Control-Allow-Origin: *"); // Permitir todos los orígenes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Permitir métodos
header("Access-Control-Allow-Headers: Content-Type"); // Permitir encabezados
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once '/var/www/html/proyecto/BackEnd/Clases/GetCarsListing.php';
$data = json_decode(file_get_contents("php://input"), true);
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($data['token'])) {
    $result = GetCarsListing::GetCarsLike($data['token']);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'No se encontraron anuncios.']);
    }
}