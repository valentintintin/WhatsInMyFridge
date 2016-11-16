<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: X-Requested-With, content-type");

$table = (isset($_GET['table']) ? htmlspecialchars($_GET['table']) : null);

if (!$table) {
    echo false;
    die;
}

$id = (isset($_GET['id']) ? htmlspecialchars($_GET['id']) : null);
$method = $_SERVER['REQUEST_METHOD'];
$data = (array)json_decode(file_get_contents("php://input"));