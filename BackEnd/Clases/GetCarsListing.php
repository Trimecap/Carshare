<?php
require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
require '../vendor/autoload.php';

use \Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;
class GetCarsListing
{
    static public $pdo = null;
    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    public static function GetCars(){
        $result = [];
        try {
            $stmt = self::$pdo->prepare("SELECT car_listings.*, makes.MAKE_name AS make_name, models.model_name AS model_name, users.username AS user_name, users.profile_image AS user_image FROM car_listings
                                                                                   JOIN makes ON car_listings.make_id = makes.id
                                                                                   JOIN models ON car_listings.model_id = models.id
                                                                                   JOIN users ON car_listings.user_id = users.id ");
            if ($stmt->execute()) {
                $result = $stmt->fetchAll();
            }
            return $result;
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }
    }

    public static function GetCarsLike($token) {
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];

        $result = [];
        try {
            $stmt = self::$pdo->prepare("
            SELECT 
                car_listings.*, 
                makes.MAKE_name AS make_name, 
                models.model_name AS model_name, 
                users.username AS user_name, 
                users.profile_image AS user_image
            FROM car_listings
            JOIN makes ON car_listings.make_id = makes.id
            JOIN models ON car_listings.model_id = models.id
            JOIN users ON car_listings.user_id = users.id
            WHERE car_listings.id IN (
                SELECT car_listing_id
                FROM likes
                WHERE user_id = :userId
            )
        ");

            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            return $result;
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }
    }
    public static function DeleteCar($id) {
        $stmt = self::$pdo->prepare("DELETE FROM car_listings WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }
}
GetCarsListing::init();