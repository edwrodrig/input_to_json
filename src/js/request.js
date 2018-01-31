var REQUEST = {};

REQUEST.call = function(url) {
  return new REQUEST.request(url);
};

REQUEST.default_callback_success = [function(data) {
  console.log(data);
}];

REQUEST.default_callback_error = [function(code, message) {
  console.log("ERROR[" + code + "] = ", message);
  alert("ERROR[" + code + "] = " + message);
}];

REQUEST.request = function(url) {
  this.url = url;
  this.params = {};
  this.callback_success = REQUEST.default_callback_success;
  this.callback_error = REQUEST.default_callback_error;
};

REQUEST.request.prototype.success = function(callback, append) {
  append = typeof append !== 'undefined' ?  append : true;
  if ( append )
    this.callback_success.push(callback);
  else
    this.callback_success = [callback];

  return this;
};

REQUEST.request.prototype.error = function(callback, append) {
  append = typeof append !== 'undefined' ?  append : true;
  if ( append )
    this.callback_error.push(callback);
  else
    this.callback_error = [callback];

  return this;
};

REQUEST.request.prototype.json = function(value) {
  r.params = value;
  return this;
};

REQUEST.request.prototype.form = function(value) {
  if ( value instanceof FormData ) {
    this.params = value;
  } else {
    var formData = new FormData();
    for ( var name in value ) {
      if ( value.hasOwnProperty(name) ) {
         var element = value[name];
         formData.append(name, element);
      }
    }
    this.params = formData;
  }
  return this;
};

REQUEST.request.prototype.call_success = function(r) {
  for ( var i = 0 ; i < this.callback_success.length ; i++ ) {
    this.callback_success[i](r);
  }  
};

REQUEST.request.prototype.call_error = function(code, message) {
  for ( var i = 0 ; i < this.callback_error.length ; i++ ) {
    this.callback_error[i](code, message);
  }
};

REQUEST.request.prototype.send = function() {
  var params = this.params;

  var xhr = new XMLHttpRequest;

  var success = this.call_success.bind(this);
  var error = this.call_error.bind(this);

  try {
    xhr.open("POST", this.url, true);

    xhr.onload = function(e) {
      try {
        if ( xhr.status != 200 )
          throw { code: xhr.status, message : xhr.statusText };
      
        var r = JSON.parse(xhr.response);
        if ( r ) {
          if ( r.status >= 0 )
            success(r.data);

          else 
            throw { code : r.status, message: r.message};

        } else {
          throw { code : -1, message: e.target.status};
        }
      } catch ( err ) {
        error(err.code, err.message);
      }
    };

    xhr.onerror = function(err) {
      console.log(xhr.response);
      error(xhr.status, err.target.status);
    };

    if ( params instanceof FormData )
      xhr.send(params);
    else
      xhr.send(JSON.stringify(params)); 
  
  } catch ( err ) {
    error(err.code, err.message);
  }
};

