edwrodrig\js 
========
Little utility javascript front-end library for simple pages

[![Latest Stable Version](https://poser.pugx.org/edwrodrig/js/v/stable)](https://packagist.org/packages/edwrodrig/js)
[![Total Downloads](https://poser.pugx.org/edwrodrig/js/downloads)](https://packagist.org/packages/edwrodrig/js)
[![License](https://poser.pugx.org/edwrodrig/js/license)](https://packagist.org/packages/edwrodrig/js)

## My use cases

I'm a back end guy but I can escape to deal with web pages. I hate current front-end development technologies, specially javascript, the [Justin Bieber](https://es.wikipedia.org/wiki/Justin_Bieber) of languages.
But you can escape to it, It's the browser language!
For me less javascript is better javascript.
 * I don't want to include this big javascript libraries in my code to do simple task that a simple script can handle.
 * I don't want to invest time finding what is the best way to do something in some fancy framework.
 * I don't want to install **nodejs** or **npm** on my development machines.
 * I want to maintain the things as [simple as possible](https://en.wikipedia.org/wiki/KISS_principle)  

These are the functionalities that contains this library:
 * Read [url params](https://en.wikipedia.org/wiki/Query_string) client side.
 * Serialize [html elements](https://www.w3schools.com/html/html_elements.asp) like inputs or simple divs to json and vice versa. Also consider nested structures.
 * Fade elements.
 * Make elements [modal](https://en.wikipedia.org/wiki/Modal_window).
 * Load [HTML templates](https://www.w3schools.com/tags/tag_template.asp) considering javascript and style resources.
 * Makes ajax json request easier for my [particular json service format](#about-my-json-requests).
 * This library must be the less invasive as posible.
 
I test all my code in __Firefox Quantum 60__ on __Ubuntu 16.04__ and in Chrome Mobile in my Android device.
I don't test that much on other platforms. I ignore backward compatibility with older browsers like IE.
Safari is a target but I do not test against it because I don't have an Apple.
I sometimes test with other webkit based browser like [Midori](http://midori-browser.org/) to replicate reported errors.

### About my json requests

My format is very particular. I'm not a fan of [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) because it mixes the json payload with [HTTP status](https://developer.mozilla.org/en/docs/Web/HTTP/Status) and [verbs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).
I like that all information goes in only one format, it makes easier when you want to implements other ways of communication, like raw TCP sockets.
In simple words, my format just put some status corresponding the function of the [HTTP status](https://developer.mozilla.org/en/docs/Web/HTTP/Status) in the json.
There is an example:
```json
{
    "status" : 1,
    "data" : {
      "name" : "Edwin",
      "surname" : "Rodriguez"
    }
}
```

My request implementation just do a post call and conveniently handle the status code to retrieve the data.
It is my particular case and I don't think anyone is using it, but it is my library.


## Documentation
The source code is documented using [jsDoc](http://usejsdoc.org/) style,
so it should pop up nicely if you're using IDEs like [PhpStorm](https://www.jetbrains.com/phpstorm) or similar.

### Examples

* [Read url params](https://github.com/edwrodrig/js/blob/master/examples/params.html)
* [Modal with pages](https://github.com/edwrodrig/js/blob/master/examples/anim_pages_modal.html)
* [Deal with inputs and json](https://github.com/edwrodrig/js/blob/master/examples/get_set.html)
* [Load HTML templates](https://github.com/edwrodrig/js/blob/master/examples/loader.html)
* [Make requests](https://github.com/edwrodrig/js/blob/master/examples/request.html)
    

## Composer
```
composer require edwrodrig/js
```

## Inclusion
Considering that this is a javascript library, composer only download the files to [vendor directory](https://getcomposer.org/doc/06-config.md#vendor-dir).
It up to you how to use in your html pages. The basic way that I use this library is to create a [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link#POSIX_and_Unix-like_operating_systems) to the [src folder](https://github.com/edwrodrig/js/blob/master/src)
so I can [include](https://www.w3schools.com/tags/att_script_src.asp) the files in the target html page. As an example see [examples folder](https://github.com/edwrodrig/js/blob/master/example) that has a symbolic link to the source folder.


## Testing
The test are built using QUnit. I don't know if they can be automated but if you just run the [test page](https://github.com/edwrodrig/js/blob/master/tests/test.html) you will see a unit test report. This is better than nothing, and in many ways is enough for me.

## License
MIT license. Use it as you want at your own risk.

## About language
I'm not a native english writer, so there may be a lot of grammar and orthographical errors on text, I'm just trying my best. But feel free to correct my language, any contribution is welcome and for me they are a learning instance.

