<?php
require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';
class PostInsertUser
{
    static public $pdo = null;
    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }

    public static function Postusers($username, $email, $fullname, $password)
    {
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM users WHERE username = :username");
            $stmt->execute([
                ':username' => $username,
            ]);

            if ($stmt->rowCount() > 0) {
                return ["KO" => "El nombre de usuario ya existe."];
            }

            $stmt = self::$pdo->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->execute([
                ':email'    => $email
            ]);

            if ($stmt->rowCount() > 0) {
                return ["KO" => "El email ya esta registrado."];
            }

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $stmt = self::$pdo->prepare("INSERT INTO users (username, email, password, full_name) 
                                     VALUES (:username, :email, :password, :fullname)");

            $stmt->execute([
                ':username' => $username,
                ':email'    => $email,
                ':password' => $hashedPassword,
                ':fullname' => $fullname
            ]);
            return ["OK" => "Usuario registrado correctamente."];
        } catch (Exception $exception) {
            return ["KO" => $exception->getMessage()];
        }
    }
}

PostInsertUser::init();