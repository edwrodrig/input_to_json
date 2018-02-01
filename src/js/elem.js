var ELEM = {};

ELEM.type = {
  plain(object) {
    Object.defineProperty(object, 'value', {
      get() { return this.e.innerHTML; },
      set(value) { this.e.innerHTML = value; }
    });
  },
  input_text(object) {
    Object.defineProperty(object, 'value', {
      get() { return this.e.value; },
      set(value) { this.e.value = value; }
    });
  },
  input_file(object) {
    Object.defineProperty(object, 'value', {
      get() { return this.e.files.length > 0 ? this.e.files[0] : null; }
    });
  },
  input_number(object) {
    Object.defineProperty(object, 'value', {
      get() { return parseInt(this.e.value); },
      set(value) { this.e.value = parseInt(value); }
    });
  },
  image(object) {
    Object.defineProperty(object, 'value', {
      get() { return this.e.src; },
      set(value) { this.e.setAttribute('src', value); }
    });
  },
  object(object) {
    Object.defineProperty(object, 'value', {
      get() {
        var elements = {};
        for ( var child of ELEM.iterate_object_elements(this.e) ) {
          if ( child.name !== undefined )
            elements[child.name] = child.value;
        }
        return elements;
      },
      set(value) {
        var a =  this.e;
        for ( var child of ELEM.iterate_object_elements(this.e) ) {
          if ( child.name !== undefined && value.hasOwnProperty(child.name) )
            child.value = value[child.name];
        }
      }
    });
  },
  array(object) {
    var item_id = object.e.getAttribute('item-template-id');
    object.item_template = document.getElementById(item_id).firstElementChild;


    object.add = function(value) {
      var item = this.item_template.cloneNode(true);
      var elem = ELEM.get(item);
      elem.value = value;
      this.e.appendChild(item);
    };

    Object.defineProperty(object, 'value', {
      get() {
        var elements = [];
        for ( var child of ELEM.iterate_array_elements(this.e) ) {
          elements.push(child.value);
        }
        return elements;
      },
      set(value) {
        this.e.innerHTML = '';

        if ( !Array.isArray(value) ) return;
        for ( var i = 0 ; i < value.length ; i++ ) {
          this.add(value[i]);
        }
      }
    });
  }
};

ELEM.get_type = function(elem) {
  var type = 'plain';

  if ( elem.tagName == 'INPUT' ) {
    var input_type = elem.hasAttribute('type') ? elem.getAttribute('type') : undefined;
    if ( input_type === undefined ) type = 'plain';
    else if ( input_type === 'text' ) type = 'input_text';
    else if ( input_type === 'file' ) type = 'input_file';
    else if ( input_type === 'number' ) type = 'input_number';
    else type = 'input_text';
  } else if ( elem.tagName == 'TEXTAREA' ) {
    type = 'input_text';
  } else if ( elem.tagName == 'IMG' ) {
    type = 'image';
  };

  type = elem.hasAttribute('data-type') ? elem.getAttribute('data-type') : type;

  return type;
};

ELEM.get = function(elem) {
  if ( typeof elem == 'string' )
    elem = document.getElementById(elem);

  var type = ELEM.get_type(elem);

  var object = { 'e' : elem };
  
  if ( elem.hasAttribute('name') )
    object.name = elem.getAttribute('name');

  object.get_element = function(name) {
    for ( var child of ELEM.iterate_object_elements(this.e) ) {
      if ( child.name == name )
        return child;
    }
    return null;
  };

  if ( ELEM.type.hasOwnProperty(type) )
    ELEM.type[type](object);
  else 
    ELEM.type.plain(object);

  return object;
};

ELEM.iterate_object_elements = function*(element) {
  var children = element.children;

  for ( var i = 0 ; i < children.length ; i++ ) {
    var child = ELEM.get(children[i]);
    if ( child.name !== undefined ) {
      yield child;
    } else {
      for ( var e of ELEM.iterate_object_elements(child.e) ) {
        yield e;
      }
    }
  }
};

ELEM.iterate_array_elements = function*(element) {
  var elements = {};
  var children = element.children;

  for ( var i = 0 ; i < children.length ; i++ ) {
    var child = ELEM.get(children[i]);
    yield child;
  }
};

