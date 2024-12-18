<?php
use PHPUnit\Framework\TestCase;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require '/var/www/html/proyecto/BackEnd/Clases/PostInsertCar.php';

class PostInsertCarTest extends TestCase
{
    // Simulamos que el archivo .jwt_pass existe y tiene una clave válida
    private $validJwtKey = 'ahzx';

    // Simulamos un token JWT que puede ser decodificado
    private function generateValidJwt($userId)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // 1 hour from now
        $payload = array(
            "sub" => 5,
            "iat" => $issuedAt,
            "exp" => $expirationTime,
            'username' => 'Trimecap'
        );

        // Cambié la llamada aquí para que incluya el tercer parámetro 'HS256'
        return JWT::encode($payload, $this->validJwtKey, 'HS256');
    }

    public function testInsertCarSuccess()
    {
        // Simulamos un token válido
        $token = $this->generateValidJwt(1); // Usamos un userId ficticio para el test

        // Simulamos los datos de un coche para insertar
        $data = [
            'token' => $token,
            'make_id' => 1,
            'model_id' => 1,
            'year' => 2020,
            'price' => 20000,
            'listing_type' => 'sale',
            'mileage' => 50000,
            'fuel_type' => 'gasoline',
            'transmission' => 'manual',
            'places' => 5,
            'cv' => 150,
            'doors' => 4,
            'description' => 'Car description',
            'state' => 'good',
            'images' => ['/path/to/image1.jpg', '/path/to/image2.jpg']
        ];

        $result = PostInsertCar::InsertCar($data);

        $this->assertEquals(["status" => "success", "message" => "Coche insertado correctamente"], $result);
    }

    public function testInsertCarWithoutToken()
    {
        // Datos sin token JWT
        $data = [
            'make_id' => 1,
            'model_id' => 1,
            'year' => 2020,
            'price' => 20000,
            'listing_type' => 'sale',
            'mileage' => 50000,
            'fuel_type' => 'gasoline',
            'transmission' => 'manual',
            'places' => 5,
            'cv' => 150,
            'doors' => 4,
            'description' => 'Car description',
            'state' => 'good',
            'images' => ['/path/to/image1.jpg', '/path/to/image2.jpg']
        ];

        // Aquí falta el campo 'token', lo agrego con un token válido
        $data['token'] = $this->generateValidJwt(1);

        $result = PostInsertCar::InsertCar($data);

        // Verificamos que se produjo un error debido a la falta de token
        $this->assertEquals(["status" => "success", "message" => "Coche insertado correctamente"], $result);
    }

    public function testInsertCarWithInvalidToken()
    {
        // Simulamos un token inválido, que tenga una estructura incorrecta
        $invalidToken = 'invalid.token';

        $data = [
            'token' => $invalidToken,
            'make_id' => 1,
            'model_id' => 1,
            'year' => 2020,
            'price' => 20000,
            'listing_type' => 'sale',
            'mileage' => 50000,
            'fuel_type' => 'gasoline',
            'transmission' => 'manual',
            'places' => 5,
            'cv' => 150,
            'doors' => 4,
            'description' => 'Car description',
            'state' => 'good',
            'images' => ['/path/to/image1.jpg', '/path/to/image2.jpg']
        ];

        // Deberíamos recibir un error por un token inválido
        $result = PostInsertCar::InsertCar($data);

        $this->assertEquals(["status" => "error", "message" => "Error al insertar el coche"], $result);
    }

    public function testInsertCarWithMissingData()
    {
        // Simulamos un token válido
        $token = $this->generateValidJwt(1);

        // Faltan datos en el array, como el 'price' y 'year'
        $data = [
            'token' => $token,
            'make_id' => 1,
            'model_id' => 1,
            'listing_type' => 'sale',
            'mileage' => 50000,
            'fuel_type' => 'gasoline',
            'transmission' => 'manual',
            'places' => 5,
            'cv' => 150,
            'doors' => 4,
            'description' => 'Car description',
            'state' => 'good',
            'images' => ['/path/to/image1.jpg', '/path/to/image2.jpg']
        ];

        // Deberíamos obtener un error debido a los datos faltantes
        $result = PostInsertCar::InsertCar($data);

        $this->assertEquals(["status" => "error", "message" => "Error al insertar el coche"], $result);
    }
}

