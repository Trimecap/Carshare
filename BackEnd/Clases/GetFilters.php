<?php

require '/var/www/html/proyecto/BackEnd/ConexionPdoEnv.php';

class GetFilters
{
    static public $pdo = null;
    static public function init()
    {
        self::$pdo = (new ConexionPdoEnv())->conectar(".envCoche");
    }
    public static function GetMakes()
    {
        $result = [];
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM makes");
            if ($stmt->execute()) {
                $result = $stmt->fetchAll();
            }
            return $result;
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }
    }

    public static function GetModels($MakeId)
    {
        $result = [];
        try {
            $stmt = self::$pdo->prepare("SELECT * FROM models WHERE make_id = :id");
            $stmt->execute([":id" => $MakeId]);
            if ($stmt->execute()) {
                $result = $stmt->fetchAll();
            }
            return $result;
        } catch (Exception $exception) {
            return ["error" => $exception->getMessage()];
        }
    }
}
GetFilters::init();
