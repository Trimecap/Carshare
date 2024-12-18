<?php

require '../ConexionPdoEnv.php';

$conexionPdo = new ConexionPdoEnv();
$pdo = $conexionPdo::conectar(".envCoche");

for ($year = 1992; $year <= 2024; $year++) {
    $csvFilePath = "./CSV/$year.csv";

    if (($handle = fopen($csvFilePath, "r")) !== FALSE) {
        // Saltar la primera línea (encabezado)
        fgetcsv($handle);

        // Leer cada fila del CSV
        while (($data = fgetcsv($handle)) !== FALSE) {
            $make = $data[1];  // Marca

            // Verificar si la marca ya existe en la base de datos
            $query = "SELECT id FROM makes WHERE make_name = ?";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(1, $make);
            $stmt->execute();

            // Si la marca no existe, la insertamos
            if ($stmt->rowCount() == 0) {
                $insertQuery = "INSERT INTO makes (make_name) VALUES (?)";
                $insertStmt = $pdo->prepare($insertQuery);
                $insertStmt->bindParam(1, $make);
                $insertStmt->execute();
                echo "Marca insertada: " . $make . " del año $year<br>";
            } else {
                echo "Marca ya existente: " . $make . " del año $year<br>";
            }

            $stmt->closeCursor();
        }
        fclose($handle);
    } else {
        echo "No se pudo abrir el archivo: $csvFilePath<br>";
    }
}
