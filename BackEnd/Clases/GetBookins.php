<?php
require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
require_once __DIR__ . '/../vendor/autoload.php';


use \Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;
class GetBookins
{
    static public $pdo = null;
    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    public static function Getbook($id){

        try {
            $stmt = self::$pdo->prepare("select start_date, end_date from bookings where car_listing_id= :id AND status = 'confirmed'");
            if ($stmt->execute(["id" => $id])) {
                $result = $stmt->fetchAll();
            }
            return $result;
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }
    }

    public static function InsertBooking($token, $id_ad, $start, $end) {
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];

        try {
            $stmt = self::$pdo->prepare("insert into bookings (car_listing_id, user_id, start_date, end_date)
            value (:id_ad, :user_id, :start_date, :end_date  )");
            $stmt->execute(["id_ad" => $id_ad, "user_id" => $userId, "start_date" => $start, "end_date" => $end]);
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }

    }

    public static function DeleteBookings($id) {
        $stmt = self::$pdo->prepare("Update bookings set status = 'cancelled' where id = :id");
        $stmt->execute(['id' => $id]);
    }
}
GetBookins::init();