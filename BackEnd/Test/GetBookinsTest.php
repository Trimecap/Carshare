<?php
require_once '/var/www/html/proyecto/BackEnd/Clases/GetBookins.php';
use \Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PHPUnit\Framework\TestCase;
use GetBookins;

class GetBookinsTest extends TestCase
{
    private $validToken;

    // Configuración previa antes de cada test
    public function setUp(): void
    {
        // Clave secreta para la firma del JWT (la misma que en la aplicación)
        $secretKey = 'ahzx';

        // ID de usuario de ejemplo
        $userId = 1;
        $username = 'testuser';

        // Tiempo de expiración del token (1 hora a partir de ahora)
        $expirationTime = time() + 3600;

        // Payload para el token
        $payload = [
            'iat' => time(),          // Time the token was issued
            'exp' => $expirationTime, // Expiration time
            'sub' => $userId,         // User ID
            'username' => $username   // Username (puedes añadir otros campos si es necesario)
        ];

        // Genera el token JWT válido con la clave secreta
        $this->validToken = JWT::encode($payload, $secretKey, 'HS256');
    }

    // Test para la función Getbook
    public function testGetBook()
    {
        // Suponiendo que el ID de coche es 1
        $id = 1;
        $result = GetBookins::Getbook($id);

        // Verifica que la respuesta sea un array
        $this->assertIsArray($result);
    }

    // Test para la función InsertBooking
    public function testInsertBooking()
    {
        // Datos de la reserva
        $id_ad = 1; // ID de coche de ejemplo
        $start = '2024-12-18 08:00:00'; // Fecha de inicio de ejemplo
        $end = '2024-12-19 08:00:00'; // Fecha de finalización de ejemplo

        // Llamamos a la función InsertBooking con el token generado
        $result = GetBookins::InsertBooking($this->validToken, $id_ad, $start, $end);

        // Verifica si el resultado no es un error
        $this->assertArrayNotHasKey('error', $result);
    }

    // Test para la función DeleteBookings
    public function testDeleteBookings()
    {
        // ID de la reserva de ejemplo
        $bookingId = 1;

        // Llamamos a la función DeleteBookings
        GetBookins::DeleteBookings($bookingId);

        // Aquí podrías agregar alguna verificación para comprobar que el estado ha cambiado
        // por ejemplo, si el estado del booking se cambia a 'cancelled'.
    }
}
