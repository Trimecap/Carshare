<?php
header("Access-Control-Allow-Origin: *"); // Permitir todos los orígenes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Permitir métodos
header("Access-Control-Allow-Headers: Content-Type"); // Permitir encabezados
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once '/var/www/html/proyecto/BackEnd/Clases/GetFilters.php';
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_REQUEST['MakeId'])) {
    $result = GetFilters::GetModels($_REQUEST['MakeId']);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode([]);
    }
}