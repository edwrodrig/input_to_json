var FORM = {};

FORM.get_type = function(e) {
  var type = 'object';

  if ( e.tagName == 'INPUT' ) {
    var attribute = e.hasAttribute('type') ? e.getAttribute('type') : 'text';
    if ( attribute == 'number') type = 'number';
    else if ( attribute == 'file' ) type = 'file';
    else type = 'default';
  }

  if ( e.hasAttribute('data-type') )
    type = e.getAttribute('data-type');

  return type;
};

FORM.get_parent = function(e) {
  do {
    if ( e.hasAttribute('service') )
      break;
  } while ( e = e.parentElement );

  return e;
};

FORM.create = function(e) {
  var type = this.get_type(e);

  if ( FORM.input.hasOwnProperty(type) )
    return new FORM.input[type](e);
  else 
    return new FORM.input.default(e);
};

FORM.input = {};

FORM.input.default = function(e) {
  this.e = e;
};

FORM.input.default.prototype.get = function() {
  return this.e.value;
};

FORM.input.default.prototype.set = function(value) {
  this.e.value = value;
};

FORM.input.default.prototype.clear = function() {
  this.e.value = '';
};

FORM.input.default.prototype.get_elements = function() {
  return {};
};

FORM.input.number = function(e) {
  FORM.input.default.call(this, e);
};

FORM.input.number.prototype = Object.create(FORM.input.default.prototype);

FORM.input.number.prototype.construct = FORM.input.number;

FORM.input.number.prototype.get = function() {
  return parseInt(this.e.value);
};

FORM.input.number.prototype.set = function(value) {
  this.e.value = parseInt(value.parseInt);
};

FORM.input.file = function(e) {
  FORM.input.default.call(this, e);
};

FORM.input.file.prototype = Object.create(FORM.input.default.prototype);

FORM.input.file.prototype.constructor = FORM.input.file;

FORM.input.file.prototype.get = function() {
  return this.e.files.length > 0 ? this.e.files[0] : null;
};

FORM.input.file.prototype.set = function(value) {;};

FORM.input.array = function(e) {
  FORM.input.default.call(this, e);

  this.body = e.querySelector('[data-type=array-body]');

  this.item = e.querySelector('[data-type=array-item]').firstElementChild;
};

FORM.input.array.prototype.get_elements = function() {
  var elements = [];

  var children = this.body.children;

  for ( var i = 0 ; i < children.length ; i ++ ) {
    var child = children[i];

    if ( child.hasAttribute('name') ) {
      elements.push(child);
    } else {
      var more_elements = FORM.create(child).get_elements();
      for ( var j = 0 ; j < more_elements.length ; j ++ ) {
        elements.push(more_elements[j]);
      }
    }
  }

  return elements;
};

FORM.input.array.prototype.new_item = function() {
  return this.item.cloneNode(true);
};

FORM.input.array.prototype.get = function() {
  var elements = this.get_elements();

  var values = [];

  for ( var i = 0 ; i < elements.length ; i++ ) {

    var element = elements[i];
    values.push(FORM.create(element).get());
  }

  return values;
};

FORM.input.array.prototype.set = function(value) {
  this.clear();

  for ( var i = 0 ; i < value.length ; i++ ) {
    this.add(value[i]);
  }
};

FORM.input.array.prototype.add = function(value) {
  var item = this.new_item();
  
  FORM.create(item).set(value);
  
  this.body.appendChild(item);
};

FORM.input.array.prototype.clear = function() {
  this.body.innerHTML = '';
};

FORM.input.object = function(e) {
  FORM.input.default.call(this, e);
};

FORM.input.object.prototype.get_elements = function() {
  var elements = {};

  var children = this.e.children;

  for ( var i = 0 ; i < children.length ; i ++ ) {

    var child = children[i];
    if ( child.hasAttribute('name') ) {

      var name = child.getAttribute('name');
      elements[name] = child;

    } else {

      var more_elements = FORM.create(child);
      more_elements = more_elements.get_elements();
      for ( var name in more_elements ) {
        if ( more_elements.hasOwnProperty(name) ) {
          elements[name] = more_elements[name];
        }
      }

    }
  }
  return elements;
};

FORM.input.object.prototype.get = function() {
  var elements = this.get_elements();
  var values = {};

  for ( var name in elements ) {
    if ( elements.hasOwnProperty(name) ) {
      values[name] = FORM.create(elements[name]).get();
    }
  }
  return values;
};

FORM.input.object.prototype.set = function(value) {
  var elements = this.get_elements();

  for ( var name in elements ) {
    if ( elements.hasOwnProperty(name) ) {
      if ( value.hasOwnProperty(name) )
        FORM.create(elements[name]).set(value[name]);
      else
        FORM.create(elements[name]).clear();
    }
  }
};

FORM.input.object.prototype.clear = function() {
  var elements = this.get_elements();

  for ( var name in elements ) {
    if ( elements.hasOwnProperty(name) ) {
      FORM.create(elements[name]).clear();
    }
  }
};

FORM.get_params = function(e, type) {
  e = FORM.get_parent(e);
  var data = FORM.create(e).get();
  if ( type === "form_data" )
    return FORM.to_form(data);
  else
    return data;
};

FORM.to_form = function(value) {
  var formData = new FormData();
  for ( var name in value ) { if ( value.hasOwnProperty(name) ) {
    var element = value[name];
    formData.append(name, element);
  }}
  return formData;
};

