<?php

$file = file_get_contents(__DIR__ . '/../js/form.js');

$url = 'https://javascript-minifier.com/raw';
$data = ['input' => $file];

// use key 'http' even if you send the request to https://...
$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

file_put_contents(__DIR__ . '/../js/form.min.js', $result);
