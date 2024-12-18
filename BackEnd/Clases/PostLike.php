<?php
require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
require_once __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;

class PostLike
{

    static public $pdo = null;

    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    static public function Likepage($id, $token)
    {
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];

        $stmt = self::$pdo->prepare("SELECT COUNT(*) FROM likes WHERE user_id = :user_id AND car_listing_id = :car_listing_id");
        $stmt->execute(['user_id' => $userId, 'car_listing_id' => $id]);
        $likeExists = $stmt->fetchColumn();

        if ($likeExists > 0) {
            return ['status' => 'error', 'message' => 'Ya has dado like a este anuncio.'];
        } else {
            $stmt = self::$pdo->prepare("INSERT INTO likes (user_id, car_listing_id) VALUES (:user_id, :car_listing_id)");
            $stmt->execute(['user_id' => $userId, 'car_listing_id' => $id]);
            return ['status' => 'success', 'message' => 'Likepage añadido con éxito.'];
        }
    }

        static public function CheckLike($token)
    {
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array) $decoded;
        $userId = $decodedArray['sub'];
        $stmt = self::$pdo->prepare("SELECT car_listing_id FROM likes WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId, ]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);



    }

    static public function DeleteLike($id, $token)
    {
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];
        $stmt = self::$pdo->prepare("DELETE FROM likes WHERE user_id = :user_id AND car_listing_id = :car_listing_id");
        $stmt->execute(['user_id' => $userId, 'car_listing_id' => $id]);
        $response = [
            'status' => 'success',
            'message' => 'Likepage eliminado correctamente',
        ];

        return $response;
    }



}
PostLike::init();