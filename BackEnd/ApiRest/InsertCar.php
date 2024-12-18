<?php
header("Access-Control-Allow-Origin: *"); // Permitir todos los orígenes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Permitir métodos
header("Access-Control-Allow-Headers: Content-Type"); // Permitir encabezados
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../Clases/PostInsertCar.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Comprobar que todos los datos necesarios están presentes y no están vacíos
    $required_fields = ['make_id', 'model_id', 'year', 'price', 'token'];
    $data = $_POST;

    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            echo json_encode(['error' => "El campo $field no puede estar vacío."]);
            exit;
        }
    }

    // Comprobar si se han subido imágenes
    if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
        $total_images = count($_FILES['images']['name']);  // Cantidad de imágenes subidas
        $uploaded_images = [];

        for ($i = 0; $i < $total_images; $i++) {
            $image_name = $_FILES['images']['name'][$i];  // Nombre del archivo
            $image_tmp_name = $_FILES['images']['tmp_name'][$i];  // Archivo temporal
            $image_error = $_FILES['images']['error'][$i];  // Posibles errores

            // Verificar si hubo errores al subir la imagen
            if ($image_error === 0) {
                // Mueve el archivo subido a un directorio seguro
                $image_destination = '/images/' . $image_name; // Asegúrate de que este directorio existe

                if (move_uploaded_file($image_tmp_name, $image_destination)) {
                    // Añadimos la imagen exitosa al array
                    $uploaded_images[] = $image_name;
                } else {
                    echo json_encode(['error' => "Error al mover la imagen $image_name."]);
                    exit;
                }
            } else {
                echo json_encode(['error' => "Error al subir la imagen $image_name."]);
                exit;
            }
        }

        // Si hemos subido imágenes, se añaden a los datos
        $data['images'] = $uploaded_images; // Guardar las imágenes en los datos
    } else {
        echo json_encode(['error' => "No se ha subido ninguna imagen."]);
        exit;
    }

    // Si todos los datos son válidos, llamar a la función de inserción
    PostInsertCar::InsertCar($data);
} else {
    // Método no permitido
    echo json_encode(['error' => 'Método no permitido']);
}
