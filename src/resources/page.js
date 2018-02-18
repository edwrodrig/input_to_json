var PAGE = {
  loaded_files : []
};

PAGE.params = function() {
  var params = location.href.split('?');
  if ( params[1] === undefined ) return [];
  var params = params[1].split('&');

  var result = {};

  for ( var i = 0 ; i < params.length ; i++ ) {
    var param = params[i].split('=');
    if ( param[0] === undefined ) continue;
    if ( param[1] === undefined ) continue;
    result[param[0]] = param[1];
  }

  return result;
};

PAGE.load_files = function(deps, callback) {
  var not_loaded = [];
  for ( var i = 0 ; i < deps.length ; i++ ) {
    if ( this.loaded_files.indexOf(deps[i]) === -1 )
      not_loaded.push(deps[i]);
  }

  if ( not_loaded.length == 0 ) {
    callback();
  } else {
    var counter = not_loaded.length;
    for ( var i = 0 ; i < not_loaded.length ; i++ ) {
      this.loaded_files.push(not_loaded[i]);
      if ( not_loaded[i].endsWith('.js') ) {
        var scriptTag = document.createElement('script');

        scriptTag.onload = function() {
          counter--;
          if ( counter <= 0 )
            callback();
        };

        scriptTag.src = not_loaded[i];
        document.body.appendChild(scriptTag);
      } else if ( not_loaded[i].endsWith('.css') ) {
        var linkTag = document.createElement('link');
        linkTag.href = not_loaded[i];
        linkTag.type = "text/css";
        linkTag.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(linkTag);

        counter--;
        if ( counter <= 0 )
          callback();
      }
    }
  }
};

