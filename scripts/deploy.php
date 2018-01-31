<?php

require_once(__DIR__ . '/../vendor/autoload.php');

mkdir(__DIR__ . '/output');

$minifier = new \MatthiasMullie\Minify\JS;
$minifier->add(\edwrodrig\js\Lib::source('elem.js'));
$minifier->add(\edwrodrig\js\Lib::source('request.js'));
$minifier->add(\edwrodrig\js\Lib::source('page.js'));

$minifier->minify(__DIR__ . '/output/request.min.js');
$minifier->gzip(__DIR__ . '/output/request.min.js.gz');

$d = new \edwrodrig\deployer\Github();
$d->user = 'edwrodrig';
$d->target = 'js';
$d->branch = 'gh-pages';
$d->source = __DIR__ . '/output';
$d();

