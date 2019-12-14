<?php
declare(strict_types=1);

namespace test\edwrodrig\js;

use edwrodrig\js\ModuleLibrary;
use Exception;
use PHPUnit\Framework\TestCase;

class ModuleLibraryTest extends TestCase
{

    public function testAvailableModules()
    {
        $availableModules = ModuleLibrary::availableModules();
        $this->assertEqualsCanonicalizing(['anim', 'elem', 'loader', 'page', 'request'], $availableModules);
    }

    /**
     * @throws Exception
     */
    public function testGetModuleFilename()
    {
        $actual = ModuleLibrary::getModuleFilename('anim');
        $this->assertStringEndsWith('anim.js', $actual);
    }

    /**
     * @throws Exception
     */
    public function testGetModuleFilenameUnknown()
    {
        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Module [unknown] does not exist!");
        $actual = ModuleLibrary::getModuleFilename('unknown');
    }

    public function testGetModuleDirectory()
    {
        $directory = ModuleLibrary::getModuleDirectory();
        $this->assertEquals(realpath(__DIR__ . '/../src/js'), $directory);
    }
}
