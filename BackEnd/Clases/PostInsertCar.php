<?php

//ficherohecho por karim
//este fichero se encarga de inser

require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
require_once __DIR__ . '/../vendor/autoload.php';
use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

class PostInsertCar
{
    static public $pdo = null;

    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    static public function InsertCar($data)
    {
        // Decodificar el token JWT
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($data['token'], new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];


        $sql = "INSERT INTO car_listings (user_id, make_id, model_id, year, price, listing_type, mileage, fuel_type, transmission, places, cv, doors, description, state, images) 
            VALUES (:user_id, :make_id, :model_id, :year, :price, :listing_type, :mileage, :fuel_type, :transmission, :places, :cv, :doors, :description, :state, :images)";

        $stmt = self::$pdo->prepare($sql);


        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':make_id', $data['make_id']);
        $stmt->bindParam(':model_id', $data['model_id']);
        $stmt->bindParam(':year', $data['year']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':listing_type', $data['listing_type']);
        $stmt->bindParam(':mileage', $data['mileage']);
        $stmt->bindParam(':fuel_type', $data['fuel_type']);
        $stmt->bindParam(':transmission', $data['transmission']);
        $stmt->bindParam(':places', $data['places']);
        $stmt->bindParam(':cv', $data['cv']);
        $stmt->bindParam(':doors', $data['doors']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':state', $data['state']);


        if (is_array($data['images'])) {
            $imagePaths = array_map(function($image) {
                return 'http://152.228.163.56/images/' . basename($image); // Guarda solo el nombre del archivo con la ruta
            }, $data['images']);
            $imagePathsJson = json_encode($imagePaths); // Convierte a JSON
        } else {
            $imagePathsJson = json_encode(['/images/' . basename($data['images'])]); // En caso de que no sea un array
        }

        $stmt->bindParam(':images', $imagePathsJson); // Asigna el JSON de imágenes


        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Coche insertado correctamente"];
        } else {
            return ["status" => "error", "message" => "Error al insertar el coche"];
        }
    }
}

PostInsertCar::init();
