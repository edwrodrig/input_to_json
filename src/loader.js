var LOADER = {
    loaded_files: []

};

LOADER.load = function(id, callback) {
  var elem = document.getElementById(id);
  var stages = elem.content.children;
  var i = stages.length - 1;
  var last_stage = stages[i];

  var last_func = (function() {
    var stage = last_stage;
    return function() {
      LOADER.load_stage(stage, callback);
    };
  })();

  i--;
  for ( ; i >= 0 ; i-- ) {
    last_stage = stages[i];
    last_func = (function() {
      var stage = last_stage;
      var func = last_func;
      return function() {
        LOADER.load_stage(stage, func);
      }
    })();  
  }
  
  last_func();
};

LOADER.load_stage = function(resources ,callback) {
  var children = resources.children;

  var not_loaded = [];

  for ( var i = 0 ; i < children.length ; i ++ ) {
    var node = children[i];
    if ( node.hasAttribute('load_key') ) {
      var load_key = node.getAttribute('load_key');

      if ( this.loaded_files.indexOf(load_key) === -1 ) {
        not_loaded.push(document.importNode(node, true));
      }
    }   
  }

  if ( not_loaded.length == 0 ) {
    callback();
  } else {
    var counter = not_loaded.length;

    var load_resource = function(node) {
      document.getElementsByTagName('head')[0].appendChild(node);
      counter--;
      if ( counter <= 0 )
        callback();
    };

    for ( var i = 0 ; i < not_loaded.length ; i++ ) {
      var node = not_loaded[i];
      this.loaded_files.push(node.getAttribute('load_key'));
      if ( node.tagName == 'LINK' ) {
        load_resource(node);
      } else if ( node.tagName == 'STYLE' ) {
        load_resource(node);
      } else if ( node.tagName == 'SCRIPT' ) {
        if ( node.hasAttribute('src') ) {
          node.onload = function() {
            counter--;
            if ( counter <= 0 )
              callback();
          }
          document.body.appendChild(node);
        } else {
          load_resource(node);
        }

      }
      
   
    }
  }
};


