var REQUEST = {};

REQUEST.services = {};

REQUEST.signal = function(e, callback) {
  e = FORM.get_parent(e);

  var service_name = e.getAttribute('service');
  
  if ( !this.services.hasOwnProperty(service_name) ) return;
  var service = this.services[service_name];

  var r = new REQUEST.request(service.url, service.params);
  r.type = service.type;

  r.params = FORM.get(e);

  if ( service.hasOwnProperty('process') )
    service.process(r);

  r.send();
}

REQUEST.request = function(url, param_info) {
  this.url = url;
  this.param_info = param_info;
  this.type = "json";

  this.success = function(data) {
    console.log(data);
  };

  this.error = function(code, message) {
    console.log("ERROR[" +code + "] = ", message);
  };
}

REQUEST.request.prototype.send = function() {
  var params = this.params;

  callback_success = this.success;
  callback_error = this.error;

  var xhr = new XMLHttpRequest;

  try {
    params;

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

    if ( this.type == 'form_data' )
      xhr.send(FORM.to_form(params));
    else
      xhr.send(JSON.stringify(params)); 
  
  } catch ( err) {
    callback_error(err.code, err.message);
  }
}

