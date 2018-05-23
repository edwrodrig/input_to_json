<?php

header("Access-Control-Allow-Origin: *");

echo json_encode([
  'status' => 0,
  'data' => $_POST
], JSON_PRETTY_PRINT);

