<?php

namespace edwrodrig\js;

class Lib {

static function source($file) {
  $file = __DIR__ . '/js/' . $file;
  if ( file_exists($file) ) {
    return $file;
  } else {
    throw new \Exception('FILE_NOT_EXISTS');
  }
}

}
