/**
 * Request module.
 *
 * To make ajax request that returns json objects.
 * Made for JSONRPC-ish services
 * @see REQUEST.call() to create a request
 * @param url
 * @constructor
 */
REQUEST = function(url) {
  this.url = url;
  this.params = {};
  this.callbackSuccess = REQUEST.defaultCallbackSuccess.slice();
  this.callbackError = REQUEST.defaultCallbackError.slice();
};

/**
 * Create a request success and error callbacks.
 * When the request is configured you can send the request
 *
 * @see REQUEST.send() To send the request
 * @see REQUEST.success() To define the success callbacks
 * @see REQUEST.error() To define the error callbacks
 * @see REQUEST.defaultCallbackError default success callbacks
 * @see REQUEST.defaultCallbackSuccess default error callbacks
 * @param url The endpoint to call
 * @returns {REQUEST}
 */
REQUEST.call = function(url) {
    return new REQUEST(url);
};

/**
 * Default success callbacks
 *
 * A list of callbacks that every new Request will have.
 * Use success method to override success a particular request callbacks, or change this variable to set the default success
 * The callbacks are processes in a FIFO way
 * @see REQUEST.success() To define the success callbacks
 * @type {*[]}
 */
REQUEST.defaultCallbackSuccess = [function(data) {
    console.log(data);
}];

/**
 * Default error callbacks
 *
 * A list of callbacks that every new Request will have.
 * Use success method to override error a particular request callbacks, or change this variable to set the default success
 * The callbacks are processes in a FIFO way
 * @see REQUEST.error() To define the success callbacks
 * @type {*[]}
 */
REQUEST.defaultCallbackError = [function(code, message) {
    console.log("ERROR[" + code + "] = ", message);
}];

/**
 * Set the current success callback
 *
 * The callback must get a first argument which is the response itself.
 * You can call this function many times, by default at every call the callback function is added to the previous one, but you can reset all with append = false
 * The callbacks are processes in a FIFO way
 * @param callback
 * @param append if the callback is appended to current callbacks, use false when you want to reset the callbacks
 * @see REQUEST.error for define error callbacks
 * @returns {REQUEST}
 */
REQUEST.prototype.success = function(callback, append) {
  append = typeof append !== 'undefined' ?  append : true;
  if ( append )
    this.callbackSuccess.push(callback);
  else
    this.callbackSuccess = [callback];

  return this;
};

/**
 * Set the current error callback
 *
 * The callback must get a first argument which is the response itself.
 * You can call this function many times, by default at every call the callback function is added to the previous one, but you can reset all with append = false
 * The callbacks are processes in a FIFO way
 * @param callback
 * @param append if the callback is appended to current callbacks, use false when you want to reset the callbacks
 * @see REQUEST.error for define error callbacks
 * @returns {REQUEST}
 */
REQUEST.prototype.error = function(callback, append) {
  append = typeof append !== 'undefined' ?  append : true;
  if ( append )
    this.callbackError.push(callback);
  else
    this.callbackError = [callback];

  return this;
};

/**
 * Set the params as a json value.
 *
 * Use this when the endpoint receives the post data in json format
 * @param value
 * @returns {REQUEST}
 */
REQUEST.prototype.json = function(value) {
  this.params = value;
  return this;
};

/**
 * Set the params as a form value.
 *
 * Use this when the endpoint receives the post or get data as a form.
 * Useful when you want to send files.
 * @param value A json or FormData
 * @returns {REQUEST}
 */
REQUEST.prototype.form = function(value) {
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

/**
 * @private
 * @param r
 */
REQUEST.prototype.callSuccess = function(r) {
  for ( let i = 0 ; i < this.callbackSuccess.length ; i++ ) {
    this.callbackSuccess[i](r);
  }  
};

/**
 * @private
 * @param code
 * @param message
 */
REQUEST.prototype.callError = function(code, message) {
  for ( let i = 0 ; i < this.callbackError.length ; i++ ) {
    this.callbackError[i](code, message);
  }
};

/**
 * Send the request.
 *
 * use this when the request has been set up
 */
REQUEST.prototype.send = function() {
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

