<?php

require_once(__DIR__ . '/../vendor/autoload.php');

$minifier = new \MatthiasMullie\Minify\JS;
$minifier->add(__DIR__ . '/../js/form.js');
$minifier->add(__DIR__ . '/../js/request.js');

$minifier->gzip(__DIR__ . '/../js/request.min.js');

