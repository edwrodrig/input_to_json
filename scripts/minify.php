<?php

require_once(__DIR__ . '/../vendor/autoload.php');

$minifier = new \MatthiasMullie\Minify\JS;
$minifier->add(__DIR__ . '/../js/form.js');
$minifier->add(__DIR__ . '/../js/request.js');

$minifier->minify(__DIR__ . '/../js/request.min.js');
$minifier->gzip(__DIR__ . '/../js/request.min.js.gz');

