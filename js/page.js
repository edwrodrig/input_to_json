var PAGE = {};

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

