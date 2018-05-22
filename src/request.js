var REQUEST = {

    call(url) {
        return new REQUEST.request(url);
    },

    defaultCallbackSuccess: [function(data) {
        console.log(data);
    }],

    defaultCallbackError: [function(code, message) {
        console.log("ERROR[" + code + "] = ", message);
    }]

};

REQUEST.request = function(url) {
  this.url = url;
  this.params = {};
  this.callbackSuccess = REQUEST.defaultCallbackSuccess.slice();
  this.callbackError = REQUEST.defaultCallbackError.slice();
};

REQUEST.request.prototype.success = function(callback, append) {
  append = typeof append !== 'undefined' ?  append : true;
  if ( append )
    this.callbackSuccess.push(callback);
  else
    this.callbackSuccess = [callback];

  return this;
};

REQUEST.request.prototype.error = function(callback, append) {
  append = typeof append !== 'undefined' ?  append : true;
  if ( append )
    this.callbackError.push(callback);
  else
    this.callbackError = [callback];

  return this;
};

REQUEST.request.prototype.json = function(value) {
  this.params = value;
  return this;
};

REQUEST.request.prototype.form = function(value) {
  if ( value instanceof FormData ) {
    this.params = value;
  } else {
    let formData = new FormData();
    for ( let name in value ) {
      if ( value.hasOwnProperty(name) ) {
         let element = value[name];
         formData.append(name, element);
      }
    }
    this.params = formData;
  }
  return this;
};

REQUEST.request.prototype.callSuccess = function(r) {
  for ( let i = 0 ; i < this.callbackSuccess.length ; i++ ) {
    this.callbackSuccess[i](r);
  }  
};

/**
 *
 * @param code
 * @param message
 */
REQUEST.request.prototype.callError = function(code, message) {
  for ( let i = 0 ; i < this.callbackError.length ; i++ ) {
    this.callbackError[i](code, message);
  }
};

REQUEST.request.prototype.send = function() {
  let params = this.params;

  let xhr = new XMLHttpRequest;

  let success = this.callSuccess.bind(this);
  let error = this.callError.bind(this);

  try {

    xhr.open("POST", this.url, true);

    /**
     * Register on load case
     * @param {ProgressEvent} progressEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload
     */
    xhr.onload = function() {
      try {
        if ( xhr.status !== 200 )
          return error(xhr.status, xhr.statusText );

        let r = JSON.parse(xhr.response);

        if ( r.status >= 0 ) {
            return success(r.data);
        } else {
            return error(r.status, r.message);
        }

      } catch ( err ) {
        if ( err instanceof SyntaxError ) {
          return error(-1, err.message);
        } else {
          return error(-1, err);
        }
      }
    };


    xhr.onerror = function(err) {
      console.log(err);
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

