var LOADER = {
    /**
     * An array with the already loaded keys.
     */
    loaded_keys: [],

    /**
     * Iterate trough loadable children
     *
     * Loadables are HTML elements that require a special treatement when appended to a document.
     * link style and script doesn't work if you append the code using simple concatenation like innerHTML += '<script></script>'
     * You need to append actual nodes to specific nodes of the document. Something on the header, other in the body.
     * This function detects every loadable nodes of elements for further processing.
     * Also generates a load key that is used to see if that node has been loaded previously
     * @param {HTMLElement} element
     * @returns {IterableIterator<*>}
     */
    iterateLoadableChildren : function* (element) {

        let children = element.children;
        for ( let i = 0 ; i < children.length ; i++ ) {
          let node = children[i];
          let load_key = '';

          if ( node.tagName === 'LINK' ) {
            load_key = node.getAttribute('href');
          } else if ( node.tagName === 'STYLE' ) {
            load_key = node.getAttribute('load');
          } else if ( node.tagName === 'SCRIPT' ) {
            if ( node.hasAttribute('src') ) {
              load_key = node.getAttribute('src');
            }
          } else {
            continue;
          }


          if ( node.hasAttribute('data-load-key') ) {
            load_key = node.getAttribute('data-load-key');
          }

          if ( !node.hasOwnProperty('load_key') ) {
              load_key = Math.random().toString(36).substr(2, 16);
          }

          if ( this.loaded_keys.indexOf(load_key) === -1 ) {
              node = document.importNode(node, true);
              // noinspection JSUndefinedPropertyAssignment
              node.load_key = load_key;
              yield node;
          }

        }
    },

    /**
     *
     * @param {HTMLElement|string} element
     * @param callback
     */
    load(element ,callback) {
        if (typeof element === 'string')
            element = document.getElementById(element);

        if (element === null)
            throw "Element is null";

        if (!element instanceof HTMLElement)
            throw "Not an HTMLElement";

        let promises = [];

        // @var {HTMLElement} childNode
        for (let childNode in this.iterateLoadableChildren(resources)) {
            this.loaded_keys.push(childNode.load_key);
            if (childNode.tagName === 'SCRIPT' && childNode.hasAttribute('src')) {
                promises.push(new Promise(resolve => {
                    childNode.onload = resolve();
                    document.body.appendChild(childNode);
                }));
            } else {
                promises.push(new Promise(resolve => {
                    document.getElementsByTagName('head')[0].appendChild(childNode);
                    resolve();
                }));
            }
        }

        Promise.all(promises).then(callback);
    }
};


