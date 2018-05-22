<?php

header("Access-Control-Allow-Origin: *");

$request = json_decode(file_get_contents('php://input'), true);

http_response_code($request);