<?php

header("Access-Control-Allow-Origin: *");

$request = json_decode(file_get_contents('php://input'), true);

echo json_encode([
  'status' => 0,
  'data' => $request
], JSON_PRETTY_PRINT);
