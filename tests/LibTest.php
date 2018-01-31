<?php

class LibTest extends \PHPUnit\Framework\TestCase {


function testSourceExists() {
  $filename = edwrodrig\js\Lib::source('elem.js');
  $this->assertFileExists($filename);
}

/**
 * @expectedException Exception
 * @expectedExceptionMessage FILE_NOT_EXISTS
 */
function testSourceNotExists() {
  edwrodrig\js\Lib::source('not_exists.js');

}

}

