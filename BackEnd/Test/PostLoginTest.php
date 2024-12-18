<?php

use PHPUnit\Framework\TestCase;
use \Firebase\JWT\JWT;
require '/var/www/html/proyecto/BackEnd/Clases/PostLogIn.php';

class PostLogInTest extends TestCase
{
    // Inicializamos las variables necesarias
    protected static $validEmail = 'test@example.com';
    protected static $validPassword = 'correctPassword';
    protected static $invalidEmail = 'wrong@example.com';
    protected static $invalidPassword = 'wrongPassword';

    // Mock de la base de datos
    protected $mockPdo;

    // Antes de cada test, inicializamos el mock de la base de datos
    public function setUp(): void
    {
        $this->mockPdo = $this->createMock(PDO::class);
        PostLogIn::$pdo = $this->mockPdo;
    }

    // Test para login con credenciales correctas
    public function testLoginWithValidCredentials()
    {
        $user = [
            'id' => 1,
            'username' => 'testuser',
            'password' => password_hash(self::$validPassword, PASSWORD_BCRYPT)
        ];

        // Mock para que devuelva el usuario cuando se busca por email
        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('fetch')->willReturn($user);
        $stmt->method('rowCount')->willReturn(1);

        // Configuramos el mock de la consulta
        $this->mockPdo->method('prepare')->willReturn($stmt);

        $result = PostLogIn::login(self::$validEmail, self::$validPassword);

        // Verificamos que el token es devuelto
        $this->assertArrayHasKey('token', $result);
    }

    // Test para login con contraseña incorrecta
    public function testLoginWithIncorrectPassword()
    {
        $user = [
            'id' => 1,
            'username' => 'testuser',
            'password' => password_hash(self::$validPassword, PASSWORD_BCRYPT)
        ];

        // Mock para que devuelva el usuario cuando se busca por email
        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('fetch')->willReturn($user);
        $stmt->method('rowCount')->willReturn(1);

        // Configuramos el mock de la consulta
        $this->mockPdo->method('prepare')->willReturn($stmt);

        $result = PostLogIn::login(self::$validEmail, self::$invalidPassword);

        // Verificamos que el resultado sea un error de contraseña incorrecta
        $this->assertArrayHasKey('KO', $result);
        $this->assertEquals('Contraseña Incorrecta', $result['KO']);
    }

    // Test para login con usuario inexistente
    public function testLoginWithNonExistentUser()
    {
        // Mock para que no devuelva ningún usuario
        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('fetch')->willReturn(false);
        $stmt->method('rowCount')->willReturn(0);

        // Configuramos el mock de la consulta
        $this->mockPdo->method('prepare')->willReturn($stmt);

        $result = PostLogIn::login(self::$invalidEmail, self::$validPassword);

        // Verificamos que el resultado sea un error de usuario no encontrado
        $this->assertArrayHasKey('KO', $result);
        $this->assertEquals('El usuario no existe', $result['KO']);
    }

    // Test para la generación de JWT
    public function testGenerateJWT()
    {
        $userId = 1;
        $username = 'testuser';
        $jwt = PostLogIn::generateJWT($userId, $username);

        // Verificamos que el JWT no sea vacío
        $this->assertNotEmpty($jwt);

        // Decodificamos el JWT para comprobar su contenido
        $decoded = JWT::decode($jwt, new \Firebase\JWT\Key('ahzx', 'HS256'));

        // Verificamos que el JWT contiene la información correcta
        $this->assertEquals($userId, $decoded->sub);
        $this->assertEquals($username, $decoded->username);

        // Verificamos que el JWT tenga una fecha de expiración válida
        $this->assertGreaterThan(time(), $decoded->exp); // La expiración debe ser mayor que el tiempo actual
    }
}