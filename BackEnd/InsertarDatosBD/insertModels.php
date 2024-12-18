<?php

require '../ConexionPdoEnv.php';

$conexionPdo = new ConexionPdoEnv();
$pdo = $conexionPdo::conectar(".envCoche");

for ($year = 1992; $year <= 2024; $year++) {
    $csvFilePath = "./CSV/$year.csv"; // Construir el nombre del archivo

    if (($handle = fopen($csvFilePath, "r")) !== FALSE) {
        // Saltar la primera línea (encabezado)
        fgetcsv($handle);

        // Leer cada fila del CSV
        while (($data = fgetcsv($handle)) !== FALSE) {
            $make = $data[1];   // Marca
            $model = $data[2];  // Modelo
            $bodyStyles = json_decode($data[3]); // Decodificar los estilos de carrocería

            // Verificar si la marca ya existe en la base de datos
            $queryMake = "SELECT id FROM makes WHERE make_name = ?";
            $stmtMake = $pdo->prepare($queryMake);
            $stmtMake->bindParam(1, $make);
            $stmtMake->execute();
            $makeId = $stmtMake->fetchColumn();

            if ($makeId) {
                // Para cada carrocería, insertar el modelo
                foreach ($bodyStyles as $bodyStyle) {
                    $modelWithBodyStyle = $model . " (" . $bodyStyle . ")"; // Concatenar el modelo con el tipo de carrocería

                    // Verificar si el modelo con esa carrocería ya existe
                    $queryModel = "SELECT id FROM models WHERE model_name = ? AND make_id = ?";
                    $stmtModel = $pdo->prepare($queryModel);
                    $stmtModel->bindParam(1, $modelWithBodyStyle);
                    $stmtModel->bindParam(2, $makeId);
                    $stmtModel->execute();

                    // Si el modelo no existe, lo insertamos
                    if ($stmtModel->rowCount() == 0) {
                        $insertModelQuery = "INSERT INTO models (model_name, make_id) VALUES (?, ?)";
                        $insertModelStmt = $pdo->prepare($insertModelQuery);
                        $insertModelStmt->bindParam(1, $modelWithBodyStyle);
                        $insertModelStmt->bindParam(2, $makeId);
                        $insertModelStmt->execute();
                        echo "Modelo insertado: " . $modelWithBodyStyle . " del año $year<br>";
                    } else {
                        echo "Modelo ya existente: " . $modelWithBodyStyle . " del año $year<br>";
                    }
                }
            } else {
                echo "Marca no encontrada: " . $make . " del año $year<br>";
            }

            $stmtMake->closeCursor(); // Liberar el cursor
        }
        fclose($handle);
    } else {
        echo "No se pudo abrir el archivo: $csvFilePath<br>";
    }
}
