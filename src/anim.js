/**
 *
 * @type {{}}
 */
var ANIM = {

    /**
     * Number of current modal windows.
     *
     * @type {number}
     */
    modal_levels: 0,

    /**
     * Trigger the fade in of an element.
     *
     * This function relies in a coordination of opacity, transition and display style properties.
     * So if you do other stuff with these properties then this function might not work
     * If the element is already visible (opacity > 0) then does nothing.
     * @param {HTMLElement|string} elem
     * @returns {boolean}
     */
    fadeIn(elem) {
        if (typeof elem === "string")
            elem = document.getElementById(elem);

        if (elem.style.opacity === null ||
            elem.style.opacity === '' ||
            elem.style.opacity === '0') {

            elem.style.opacity = '0';
            elem.style.transition = "opacity 0.5s";

            //if you don't do these changes in their animation frames then browser
            //do optimizations that does not do the expected behavior.
            //at least firefox need this
            requestAnimationFrame(function () {
                elem.style.display = '';
                requestAnimationFrame(function () {
                    elem.style.opacity = '1';
                });
            });
            return true;
        }
        return false;
    },

    /**
     * Trigger the fade out of an element.
     *
     * If the element is already visible (opacity > 0) then does nothing.
     * So if you do other stuff with these properties then this function might not work
     * If the element is already visible (opacity > 0) then does nothing.
     * @param {HTMLElement|string} elem
     * @returns {boolean}
     */
    fadeOut(elem) {
        if (typeof elem === "string")
            elem = document.getElementById(elem);

        if (elem.style.opacity === null ||
            elem.style.opacity === '' ||
            elem.style.opacity === '1') {
            elem.style.transition = "opacity 0.5s";
            elem.style.opacity = '0';
            setTimeout(function () {
                if (elem.style.opacity === '0')
                    elem.style.display = 'none';
            }, 500);
            return true;
        }

        return false;
    },

    /**
     * Show a element as a modal.
     *
     * Put the element in fullscreen mode
     * @param {HTMLElement|string} elem An element or id
     */
    modalIn(elem) {
        if (typeof elem === "string")
            elem = document.getElementById(elem);

        elem.style.top = '0';
        elem.style.left = '0';
        elem.style.position = 'fixed';
        elem.style.width = '100%';
        elem.style.height = '100%';
        if (ANIM.fadeIn(elem)) {
            if (ANIM.modal_levels === 0)
                document.body.style.overflow = 'hidden';
            ANIM.modal_levels++;
        }
    },

    /**
     * Hide a shown modal element
     *
     * @param {HTMLElement|string} elem An element or id
     */
    modalOut(elem) {
        if (typeof elem === "string")
            elem = document.getElementById(elem);

        if (ANIM.fadeOut(elem)) {
            if (ANIM.modal_levels === 1) {

                document.body.style.overflow = null;
            }
            ANIM.modal_levels--;
        }
    },

    /**
     * Change a page of a
     *
     * The paged element must have the following form
     * ```
     * <div id="elem">
     *     <div data-page-name="a"></div>
     *     <div data-page-name="b"></div>
     * </div>
     * ```
     * @param {HTMLElement|string} elem An element or id
     * @param {string} page_name
     */
    changePage(elem, page_name) {
        if (typeof elem === "string")
            elem = document.getElementById(elem);

        let children = elem.children;

        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let current_page_name = child.getAttribute('data-page-name');

            if (current_page_name === page_name)
                ANIM.fadeIn(child);
            else
                ANIM.fadeOut(child);
        }
    }

};



