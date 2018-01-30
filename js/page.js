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

PAGE.elem = function(elem) {
  if ( typeof elem == 'string' )
    elem = document.getElementById(elem);

  var object = { 'e' : elem };
  if ( elem.tagName == 'INPUT' ) {
    
    Object.defineProperty(object, {
      get: function() { return this.e.value; },
      set: function(value) { this.e.value = value; }
    });
  } else if ( elem.tagName == 'IMG' ) {
    Object.defineProperty(object, {
      get: function() { return this.e.src; },
      set: function(value) { this.e.setAttribute('src', value); }
    });
  } else {
    Object.defineProperty(object, {
      get: function() { return this.e.innerHTML; },
      set: function(value) { this.e.innerHTML = value; }
    });
  }
}

PAGE.set_value = function(elem, value) {
  try {
    if ( typeof elem == 'string' )
      elem = document.getElementById(elem);
  
    if ( value instanceof Array || value instanceof Object )
      value = JSON.stringify(value, null, 2);

    if ( elem.tagName == 'INPUT' ) {
      elem.value = value;
    } else if ( elem.tagName == 'IMG' ) {
      elem.setAttribute('src', value);
    } else {
      elem.innerHTML = value;
    }
  } catch (err) {
    console.log(err);
  }
};

