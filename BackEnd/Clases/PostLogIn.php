<?php
require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
require_once __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;
define('JWT_SECRET_KEY_PATH', '/var/www/html/proyecto/BackEnd/.jwt_pass');
define('JWT_SECRET_KEY', trim(file_get_contents(JWT_SECRET_KEY_PATH)));
define('JWT_EXPIRATION_TIME', 2592000);

class PostLogIn
{
    static public $pdo = null;

    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    static public function login($email, $password)
    {
        $stmt = self::$pdo->prepare("SELECT id, username, password FROM users WHERE email = :email");
        $stmt->execute(["email" => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($stmt->rowCount() === 1) {
            if (password_verify($password, $user['password'])) {
                $token = self::generateJWT($user['id'], $user['username']);
                return ['token' => $token];
            } else {
                return ['KO' => 'Contraseña Incorrecta'];
            }
        } else {
            return ['KO' => 'El usuario no existe'];
        }
    }
    static public function generateJWT($userId, $username)
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

PostLogIn::init();
