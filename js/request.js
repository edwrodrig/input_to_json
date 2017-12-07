var REQUEST = {};

REQUEST.call = function(url, params, process) {
  var r = new REQUEST.request(url);
  r.params = params;

  if ( typeof process === "function" ) {
    process(r);
  }

  r.send();
};

REQUEST.request = function(url) {
  this.url = url;

  this.success = function(data) {
    console.log(data);
  };

  this.error = function(code, message) {
    console.log("ERROR[" + code + "] = ", message);
  };
};

REQUEST.request.prototype.send = function() {
  var params = this.params;

  var callback_success = this.success;
  var callback_error = this.error;

  var xhr = new XMLHttpRequest;

  try {
    xhr.open("POST", this.url, true);

    xhr.onload = function(e) {
      try {
        if ( xhr.status != 200 )
          throw { code: xhr.status, message : xhr.statusText };
      
        var r = JSON.parse(xhr.response);
        if ( r ) {
          if ( r.status >= 0 )
            callback_success(r.data);

          else 
            throw { code : r.status, message: r.message};

        } else {
          throw { code : -1, message: e.target.status};
        }
      } catch ( err ) {
        callback_error(err.code, err.message);
      }
    };

    xhr.onerror = function(err) {
      console.log(xhr.response);
      callback_error(xhr.status, err.target.status);
    };

    if ( params instanceof FormData )
      xhr.send(params);
    else
      xhr.send(JSON.stringify(params)); 
  
  } catch ( err) {
    callback_error(err.code, err.message);
  }
};

