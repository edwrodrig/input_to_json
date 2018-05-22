<?php

header("Access-Control-Allow-Origin: *");

echo json_encode([
  'status' => 0,
  'data' => $_FILES['file']
], JSON_PRETTY_PRINT);

