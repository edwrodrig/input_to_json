<?php

require_once(__DIR__ . '/../vendor/autoload.php');

mkdir(__DIR__ . '/output');

$minifier = new \MatthiasMullie\Minify\JS;
$minifier->add(__DIR__ . '/../js/elem.js');
$minifier->add(__DIR__ . '/../js/request.js');
$minifier->add(__DIR__ . '/../js/page.js');

$minifier->minify(__DIR__ . '/output/request.min.js');
$minifier->gzip(__DIR__ . '/output/request.min.js.gz');

$d = new \edwrodrig\deployer\Github();
$d->user = 'edwrodrig';
$d->target = 'js';
$d->branch = 'gh-pages';
$d->source = __DIR__ . '/output';
$d();

