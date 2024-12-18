<?php
use PHPUnit\Framework\TestCase;
require '/var/www/html/proyecto/BackEnd/Clases/PostInsertUser.php';

class PostInsertUserTest extends TestCase
{
    private $mockPdo;
    private $mockStmt;

    protected function setUp(): void
    {
        // Mock de PDO y PDOStatement
        $this->mockPdo = $this->createMock(PDO::class);
        $this->mockStmt = $this->createMock(PDOStatement::class);

        // Asignar el mock de PDO a la clase estática PostInsertUser
        PostInsertUser::$pdo = $this->mockPdo;

        // Mock de la función prepare para que siempre devuelva un stmt simulado
        $this->mockPdo->method('prepare')->willReturn($this->mockStmt);
    }

    public function testRegisterUserSuccess()
    {
        // Datos de prueba
        $username = 'newuser';
        $email = 'newuser@example.com';
        $fullname = 'New User';
        $password = 'securepassword123';

        // Mock de la consulta para verificar si el nombre de usuario existe
        $this->mockStmt->method('execute')->willReturn(true);
        $this->mockStmt->method('rowCount')->willReturn(0); // Usuario no existe

        // Mock de la consulta para verificar si el correo electrónico existe
        $this->mockStmt->method('execute')->willReturn(true);
        $this->mockStmt->method('rowCount')->willReturn(0); // Correo no registrado

        // Mock de la ejecución de la inserción en la base de datos
        $this->mockStmt->method('execute')->willReturn(true);

        // Llamar al método que se va a probar
        $result = PostInsertUser::Postusers($username, $email, $fullname, $password);

        // Verificar que el resultado es el esperado
        $this->assertEquals(["OK" => "Usuario registrado correctamente."], $result);
    }

    public function testUsernameAlreadyExists()
    {
        // Datos de prueba
        $username = 'Trimecap';
        $email = 'elgame96@gmail.com';  // Este correo debe existir ya en la base de datos
        $fullname = 'Karim El ouazzani Aguilar';
        $password = '1234';

        // Mock de la consulta para verificar si el nombre de usuario existe
        $this->mockStmt->method('execute')->willReturn(true);
        $this->mockStmt->method('rowCount')->willReturn(1); // Nombre de usuario ya existe

        // Llamar al método que se va a probar
        $result = PostInsertUser::Postusers($username, $email, $fullname, $password);

        // Verificar que el resultado es el esperado
        $this->assertEquals(["KO" => "El nombre de usuario ya existe."], $result);
    }

    public function testEmailAlreadyExists()
    {
        // Datos para el nuevo usuario
        $username = 'Trimecap';
        $email = 'elgame96@gmail.com';  // Este correo debe existir ya en la base de datos
        $fullname = 'Karim El ouazzani Aguilar';
        $password = '1234';

        // Asegúrate de que el correo ya existe en la base de datos
        $existingEmail = 'user@example.com';  // Este es el correo duplicado que estamos verificando
        $this->assertNotEmpty(PostInsertUser::Postusers('testuser', $existingEmail, 'Another Name', 'password'));

        // Ahora probamos el método con el correo que ya existe
        $result = PostInsertUser::Postusers($username, $email, $fullname, $password);

        // Comprobamos que la respuesta sea la esperada cuando el correo ya existe
        $this->assertEquals(["KO" => "El email ya esta registrado."], $result);
    }


    public function testExceptionHandling()
    {
        // Datos de prueba
        $username = 'userwitherror';
        $email = 'erroruser@example.com';
        $fullname = 'User With Error';
        $password = 'password123';

        // Hacer que el prepare lance una excepción para simular un error en la base de datos
        $this->mockPdo->method('prepare')->will($this->throwException(new Exception("Database error")));

        // Llamar al método que se va a probar y verificar que devuelve el mensaje de error adecuado
        $result = PostInsertUser::Postusers($username, $email, $fullname, $password);

        // Verificar que el resultado es el esperado
        $this->assertEquals(["KO" => "Database error"], $result);
    }
}
