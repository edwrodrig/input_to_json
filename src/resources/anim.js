var ANIM = {};

ANIM.modal_levels = 0;

ANIM.fade_in = function(elem) {
  if ( elem.style.opacity == "" || elem.style.opacity == 0 ) {
    elem.style.opacity = 0;
    elem.style.transition = "opacity 0.5s";
    requestAnimationFrame(function() {
      elem.style.display = 'block';
      requestAnimationFrame(function() {
        elem.style.opacity = 1;
      });
    });
    return true;
  }

  return false;
};

ANIM.fade_out = function(elem) {
  if ( elem.style.opacity == "" || elem.style.opacity == 1 ) {
    elem.style.transition = "opacity 0.5s";
    elem.style.opacity = 0;
    setTimeout(function() {
      elem.style.display = 'none';
    }, 500);
    return true;
  }

  return false;
};

ANIM.modal_in = function(elem) {
   elem.style.top = 0;
   elem.style.left = 0;
   elem.style.position = 'fixed';
   elem.style.width = '100%';
   elem.style.height = '100%';
   if ( ANIM.fade_in(elem) ) {
     if ( ANIM.modal_levels == 0 )
       document.body.style.overflow = 'hidden';
     ANIM.modal_levels++;
   }
};

ANIM.modal_out = function(elem) {
  if ( ANIM.fade_out(elem) ) {
    if ( ANIM.modal_levels == 1 )
      document.body.style.overflow = null;
    ANIM.modal_levels--;
  }
};

ANIM.change_page = function(elem, target) {
  var children = elem.children;

  for ( var i = 0 ; i < children.length ; i++ ) {
    var child = children[i];
    var page_name = child.getAttribute('page_name');

    if ( page_name == target )
      ANIM.fade_in(child);
    else
      ANIM.fade_out(child);
  }
};



