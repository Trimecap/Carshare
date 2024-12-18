<?php
require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
require '../vendor/autoload.php';

use \Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;
class GetUser
{
    static public $pdo = null;
    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    public static function Getdatauser($token){
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];
        try {
            $query_user = "SELECT username, profile_image FROM users WHERE id = :user_id";
            $stmt_user = self::$pdo->prepare($query_user);
            $stmt_user->execute(['user_id' => $userId]);
            $user = $stmt_user->fetch(PDO::FETCH_ASSOC);

            $query_listings = "SELECT cl.id AS car_listing_id, cl.year, cl.price, cl.listing_type, cl.mileage, cl.fuel_type, cl.transmission, cl.cv, cl.places, cl.doors, cl.description, cl.images AS car_images, m.make_name AS make, mo.model_name AS model FROM car_listings cl LEFT JOIN makes m ON cl.make_id = m.id LEFT JOIN models mo ON cl.model_id = mo.id WHERE cl.user_id = :user_id";
            $stmt_listings = self::$pdo->prepare($query_listings);
            $stmt_listings->execute(['user_id' => $userId]);
            $listings = $stmt_listings->fetchAll(PDO::FETCH_ASSOC);

            $query_bookings = "SELECT b.id, b.start_date AS booking_start_date, b.end_date AS booking_end_date, cl.id AS car_listing_id, m.make_name AS booking_make, mo.model_name AS booking_model, cl.images AS booking_car_images FROM bookings b JOIN car_listings cl ON b.car_listing_id = cl.id LEFT JOIN makes m ON cl.make_id = m.id LEFT JOIN models mo ON cl.model_id = mo.id WHERE b.user_id = :user_id AND b.status = 'confirmed'";
            $stmt_bookings = self::$pdo->prepare($query_bookings);
            $stmt_bookings->execute(['user_id' => $userId]);
            $bookings = $stmt_bookings->fetchAll(PDO::FETCH_ASSOC);

            $reserva = "SELECT 
    b.id AS booking_id,              
    b.start_date,                     
    b.end_date,                       
    cl.images AS listing_image,       
    cl.id AS car_listing_id           
FROM 
    car_listings cl
JOIN 
    bookings b ON cl.id = b.car_listing_id
WHERE 
    cl.user_id = ? AND b.status = 'confirmed'
";

            $stmt_reserva = self::$pdo->prepare($reserva);
            $stmt_reserva->execute([$userId]);
            $reservas = $stmt_reserva->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'user' => $user,
                'listings' => $listings,
                'bookings' => $bookings,
                'reservas' => $reservas
            ];
            return $response;
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }
    }

    public static function Updatedatauser($token, $imagen){
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));
        $decoded = JWT::decode($token, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];

        $stmt = self::$pdo->prepare("UPDATE users SET profile_image = :profile_image WHERE id = :user_id");
        $stmt->execute(['profile_image' => $imagen, 'user_id' => $userId]);
    }

    public static function getProfileUser($id)
    {
        $stmt = self::$pdo->prepare("SELECT u.username, u.profile_image
                                FROM car_listings c
                                JOIN users u ON c.user_id = u.id
                                WHERE c.id = :car_listing_id;
");
        $stmt->execute(['car_listing_id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function Conversation($userad, $user, $adId)
    {
        // Leer el archivo de clave secreta para JWT
        $file = '../.jwt_pass';
        $password = trim(file_get_contents($file));

        // Decodificar el JWT
        $decoded = JWT::decode($user, new Key($password, 'HS256'));
        $decodedArray = (array)$decoded;
        $userId = $decodedArray['sub'];

        // Verificar si la conversación ya existe
        $stmt = self::$pdo->prepare("SELECT id FROM conversations 
                                 WHERE user_advertiser_id = :user_advertiser_id 
                                 AND user_contacting_id = :user_contacting_id 
                                 AND ad_id = :ad_id");
        $stmt->execute([
            'user_advertiser_id' => $userad,
            'user_contacting_id' => $userId,
            'ad_id' => $adId
        ]);

        // Verificar si ya existe una conversación
        $existingConversation = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existingConversation) {
            // Si ya existe, devolver el ID de la conversación existente
            return $existingConversation['id'];
        }

        // Si no existe, crear una nueva conversación
        $stmt = self::$pdo->prepare("INSERT INTO conversations (user_advertiser_id, user_contacting_id, ad_id) 
                                 VALUES (:user_advertiser_id, :user_contacting_id, :ad_id)");
        $stmt->execute([
            'user_advertiser_id' => $userad,
            'user_contacting_id' => $userId,
            'ad_id' => $adId
        ]);

        // Obtener el último ID insertado (que sería el conversation_id)
        return self::$pdo->lastInsertId();
    }


}
GetUser::init();