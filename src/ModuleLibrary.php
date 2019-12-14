<?php
declare(strict_types=1);

namespace edwrodrig\js;

use Exception;

/**
 * Class ModuleLibrary
 * Modules are javascript files that has some functionality.
 * This class is useful to have
 * @package edwrodrig\js
 */
class ModuleLibrary
{
    private static $baseDirectory = __DIR__ . '/js';

    /**
     * Get the module directory.
     * is the full path of the directory that has all modules
     * @return string
     */
    public static function getModuleDirectory() : string {
        return realpath(self::$baseDirectory);
    }

    /**
     * Get the filename of a module.
     * Is the full path of a available module
     * @param string $module
     * @return string
     * @throws Exception
     */
    public static function getModuleFilename(string $module) : string {
            $filename = self::getModuleDirectory() . '/' . $module . '.js';
            if ( !file_exists($filename) ) {
                throw new Exception(sprintf("Module [%s] does not exist!", $module));
            }
            return $filename;

    }

    /**
     * Get the available modules.
     * A list with the base filename without extension of the available modules
     * @return string[]
     */
    public static function availableModules() : array {
        return array_map(
            function(string $moduleFilename) {
                $basename = basename($moduleFilename);
                return str_replace('.js', '', $basename);
            },
            glob(self::getModuleDirectory() . '/*.js' )
        );

    }
}