var ELEM = {

    /**
     *
     * @param {HTMLElement|string} element or id
     * @returns {HTMLElement}
     */
    normalizeElement(element) {
        if (typeof element === 'string')
            element = document.getElementById(element);

        if (element === null)
            throw "Element is null";

        if (!element instanceof HTMLElement)
            throw "Not an HTMLElement";

        return element;

    },

    /**
     * Get the type name of an element.
     *
     * The type name is not a javascript type, it mentions to this library type element.
     *
     * @param {HTMLElement} element
     * @returns {string}
     */
    getType(element) {
        element = this.normalizeElement(element);

        if (element.hasAttribute('data-type')) {
            return element.getAttribute('data-type');

        } else {

            if (element.tagName === 'INPUT') {
                let input_type = element.hasAttribute('type') ? element.getAttribute('type') : null;

                if (input_type === null) return 'plain';
                else if (input_type === 'text') return 'input_text';
                else if (input_type === 'file') return 'input_file';
                else if (input_type === 'number') return 'input_number';
                else if (input_type === 'checkbox') return 'input_checkbox';
                else return 'input_text';

            } else if (element.tagName === 'TEXTAREA') {
                return 'input_text';

            } else if (element.tagName === 'IMG') {
                return 'image';

            } else {
                return 'plain';
            }
        }

    },

    /**
     * Get an element usable for easy input
     *
     * you can get the values or set by the dynamic property .value and get nested element by getElement
     * @param element element or id
     * @returns {{e: *}}
     */
    get(element) {

        element = this.normalizeElement(element);

        let type = ELEM.getType(element);

        let object = {
            e: element
        };

        if (element.hasAttribute('name'))
            object.name = element.getAttribute('name');

        if ( element.hasAttribute('data-name'))
            object.name = element.getAttribute('data-name');

        if (ELEM.type.hasOwnProperty(type))
            ELEM.type[type](object);
        else
            ELEM.type.plain(object);

        return object;
    },


    /**
     * Iterate the objects elements.
     *
     * If element is an object then iterate each element with a name attribute.
     * If a element with a name attribute has other name attributes inside then they are ignored,
     * because they are children of the children and not of the parent element.
     * @param {HTMLElement} element
     * @returns {IterableIterator<*>}
     */
    iterateObjectElements: function* (element) {
        element = this.normalizeElement(element);

        let children = element.children;

        for (let i = 0; i < children.length; i++) {
            let child = ELEM.get(children[i]);
            if (child.name !== undefined) {
                yield child;
            } else {
                yield* ELEM.iterateObjectElements(child.e);
            }
        }
    },


    /**
     *
     * @param {HTMLElement} element
     * @returns {IterableIterator<{e: *}|{e}>}
     */
    iterateArrayElements: function* (element) {
        element = this.normalizeElement(element);

        let children = element.children;

        for (let i = 0; i < children.length; i++) {
            let child = ELEM.get(children[i]);
            yield child;
        }
    },


    type: {

        /**
         * For a plain object you just get and set the innerHTML
         * @param object
         * @returns {*}
         */
        plain(object) {
            Object.defineProperty(object, 'value', {
                get() {
                    return this.e.innerHTML;
                },
                set(value) {
                    this.e.innerHTML = value;
                }
            });
        },

        input_text(object) {
            Object.defineProperty(object, 'value', {
                get() {
                    return this.e.value;
                },
                set(value) {
                    this.e.value = value;
                }
            });
        },

        input_file(object) {
            Object.defineProperty(object, 'value', {
                get() {
                    return this.e.files.length > 0 ? this.e.files[0] : null;
                }
            });
        },

        input_number(object) {
            Object.defineProperty(object, 'value', {
                get() {
                    return parseInt(this.e.value);
                },
                set(value) {
                    this.e.value = parseInt(value);
                }
            });
        },

        input_checkbox(object) {
            Object.defineProperty(object, 'value', {
                get() {
                    return this.e.checked;
                },
                set(value) {
                    this.e.checked = value;
                }
            });
        },

        /**
         * Initializer for a image item
         *
         * Just get and set the src value of the image
         * @param object
         * @returns {*}
         */
        image(object) {
            Object.defineProperty(object, 'value', {
                get() {
                    return this.e.src;
                },
                set(value) {
                    this.e.setAttribute('src', value);
                }
            });
        },

        /**
         * To edit object elements
         * @param object
         */
        object(object) {


            object.getElement = function (name) {
                for (let child of ELEM.iterateObjectElements(this.e)) {
                    if (child.name === name)
                        return child;
                }
                return null;
            }

            Object.defineProperty(object, 'value', {
                get() {
                    let elements = {};
                    for (let child of ELEM.iterateObjectElements(this.e)) {
                        if (child.name !== undefined)
                            elements[child.name] = child.value;
                    }
                    return elements;
                },
                set(value) {
                    for (let child of ELEM.iterateObjectElements(this.e)) {
                        if (child.name !== undefined && value.hasOwnProperty(child.name))
                            child.value = value[child.name];
                    }
                }
            });
        },

        /**
         * To edit list elements
         * @param object
         * @returns {*}
         */
        array(object) {
            let item_id = object.e.getAttribute('data-item-template-id');
            object.item_template = document.getElementById(item_id).content.firstElementChild;


            object.add = function (value) {
                let item = this.item_template.cloneNode(true);
                let elem = ELEM.get(item);
                elem.value = value;
                this.e.appendChild(item);
            };

            Object.defineProperty(object, 'value', {
                get() {
                    let elements = [];
                    for (let child of ELEM.iterateArrayElements(this.e)) {
                        elements.push(child.value);
                    }
                    return elements;
                },
                set(value) {
                    this.e.innerHTML = '';

                    if (!Array.isArray(value)) return;
                    for (let i = 0; i < value.length; i++) {
                        this.add(value[i]);
                    }
                }
            });
        }
    }
};





