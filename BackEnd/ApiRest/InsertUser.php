<?php
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '/var/www/html/proyecto/BackEnd/Clases/PostInsertUser.php';


$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($data['userName'], $data['email'], $data['fullName'], $data['password'])) {
    $result = PostInsertUser::Postusers($data['userName'], $data['email'], $data['fullName'], $data['password']);
    echo json_encode($result);
}
