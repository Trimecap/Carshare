<?php
header("Access-Control-Allow-Origin: *"); // Permitir todos los orígenes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE"); // Permitir métodos
header("Access-Control-Allow-Headers: Content-Type"); // Permitir encabezados
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once '/var/www/html/proyecto/BackEnd/Clases/GetCarsListing.php';
$input = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $carListingId = $input['carListingId'];
    $result = GetCarsListing::DeleteCar($carListingId);

}