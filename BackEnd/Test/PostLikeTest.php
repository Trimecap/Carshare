<?php
use PHPUnit\Framework\TestCase;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require '/var/www/html/proyecto/BackEnd/Clases/PostLike.php';
define('JWT_SECRET_KEY_PATH', '/var/www/html/proyecto/BackEnd/.jwt_pass');
define('JWT_SECRET_KEY', trim(file_get_contents('/var/www/html/proyecto/BackEnd/.jwt_pass')));
define('JWT_EXPIRATION_TIME', 2592000);

class PostLikeTest extends TestCase
{
    private $postLike;
    private $mockPdo;
    private $mockStmt;

    protected function setUp(): void
    {
        // Mock the PDO object and the statement
        $this->mockPdo = $this->createMock(PDO::class);
        $this->mockStmt = $this->createMock(PDOStatement::class);

        // Instantiate the PostLike class
        PostLike::$pdo = $this->mockPdo;

        // Mock the behavior of the PDOStatement for different queries
        $this->mockPdo->method('prepare')->willReturn($this->mockStmt);
    }

    public function testLikepageSuccess()
    {
        $id = 1;
        $token = $this->generateJWT(1, 'user@example.com'); // Genera un token para el usuario

        // Mock the JWT decoding part
        $mockDecoded = (object)['sub' => 1];  // Mock decoded JWT with user ID = 1
        JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));  // Usa la misma clave secreta

        // Mock the query to check if the user already liked the car
        $this->mockStmt->method('execute')->willReturn(true);
        $this->mockStmt->method('fetchColumn')->willReturn(0); // No like exists

        // Mock the insert query when user likes a car
        $this->mockStmt->method('execute')->willReturn(true);

        // Perform the like action
        $result = PostLike::Likepage($id, $token);

        // Assert that the result is successful
        $this->assertEquals(['status' => 'success', 'message' => 'Likepage añadido con éxito.'], $result);
    }

    public function testLikepageAlreadyLiked()
    {
        $id = 1;
        $token = $this->generateJWT(1, 'user@example.com'); // Genera un token para el usuario

        // Mock the JWT decoding part
        $mockDecoded = (object)['sub' => 1];  // Mock decoded JWT with user ID = 1
        JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));

        // Mock the query to check if the user already liked the car
        $this->mockStmt->method('execute')->willReturn(true);
        $this->mockStmt->method('fetchColumn')->willReturn(1); // Like exists

        // Perform the like action
        $result = PostLike::Likepage($id, $token);

        // Assert that the result indicates the like already exists
        $this->assertEquals(['status' => 'error', 'message' => 'Ya has dado like a este anuncio.'], $result);
    }

    public function testCheckLike()
    {
        $token = $this->generateJWT(1, 'user@example.com'); // Genera un token para el usuario

        // Mock the JWT decoding part
        $mockDecoded = (object)['sub' => 1];  // Mock decoded JWT with user ID = 1
        JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));

        // Mock the query to fetch liked car listings
        $this->mockStmt->method('execute')->willReturn(true);
        $this->mockStmt->method('fetchAll')->willReturn([1, 2, 3]); // Return car listings liked by the user

        // Perform the check
        $result = PostLike::CheckLike($token);

        // Assert that the result contains the liked car listings
        $this->assertEquals([1, 2, 3], $result);
    }

    public function testDeleteLikeSuccess()
    {
        $id = 1;
        $token = $this->generateJWT(1, 'user@example.com'); // Genera un token para el usuario

        // Mock the JWT decoding part
        $mockDecoded = (object)['sub' => 1];  // Mock decoded JWT with user ID = 1
        JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));

        // Mock the delete query execution
        $this->mockStmt->method('execute')->willReturn(true);

        // Perform the delete action
        $result = PostLike::DeleteLike($id, $token);

        // Assert that the result indicates success
        $this->assertEquals(
            ['status' => 'success', 'message' => 'Likepage eliminado correctamente'],
            $result
        );
    }

    // Helper function to generate JWT for testing purposes
    private function generateJWT($userId, $username)
    {
        $key = JWT_SECRET_KEY;
        $expirationTime = time() + JWT_EXPIRATION_TIME;

        $payload = [
            'iat' => time(),
            'exp' => $expirationTime,
            'sub' => $userId,
            'username' => $username
        ];

        return JWT::encode($payload, $key, 'HS256');
    }
}
