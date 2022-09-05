 // ==UserScript==
// @name         Reddit Bidi support
// @namespace    http://reddit.com/r/arabic_linux
// @version      0.2
// @description  Keyboard shortcuts for switching text direction RTL to LTR.
// @author       https://reddit.com/u/avid-seeker
// @icon         https://www.google.com/s2/favicons?domain=reddit.com&sz=128
// @include      https://www.reddit.com/*
// @include      https://old.reddit.com/*
// @grant        none
// @license      GPL3
// ==/UserScript==

/**
 *        READ THIS TO CONFIGURE THE SHORTCUTS
 *        ====================================
 *
 * By default, the shortcuts are:
 *     Alt-U to upvote
 *     Alt-D to downvote
 *     Alt-G to go to the page linked on the Reddit post
 *     Alt-S to save
 *
 * To change them to something else, edit the entries under the line that says 'use strict'.
 * For each shortcut you'll need to set a _letter_ corresponding to a key on your keyboard that triggers
 * the shortcut, and you'll also need to set the modifiers associated with it. Modifiers are other keys
 * you also press to activate the shortcut, like alt, ctrl, shift, etc. The "meta" modifier is the Windows key
 * on most PC keyboards, and the Command key (⌘) on macOS.
 *
 * For example, if you want to upvote when you press ctrl-shift-u,
 * you'll need to edit the config that says "upvote" to read:
 *      {
 *          letter: 'u',
 *          needsModifierShift: true,
 *          needsModifierCtrl: true,
 *      },
 *
 */

(function() {
    'use strict';

    /* change the values below ⬇⬇⬇⬇ to configure the shortcuts */
    const SHORTCUT_CONFIGS = {
        ltr: {
            letter: 'f',
        },
        rtl: {
            letter: 'd',
        },
    };
    /* change the values above ⬆⬆⬆⬆ to configure the shortcuts */

    function isEnabled(obj, key) {
        return key in obj && obj[key] === true;
    }

    function triggerAction(action) {
        switch(action) {
            case 'ltr':
                document.querySelector('div[data-test-id="post-content"]').setAttribute("style", "direction: rtl;");
                document.querySelector('.entry').setAttribute("style", "direction: rtl;");
                document.querySelector('commentarea').setAttribute("style", "direction: rtl;"); 
                break;
            case 'rtl':
                document.querySelector('div[data-test-id="post-content"]').setAttribute("style", "direction: ltr;");
                document.querySelector('.entry').setAttribute("style", "direction: ltr;");
                document.querySelector('commentarea').setAttribute("style", "direction: ltr;"); 
                break;
        }
    }

    function handleEvent(e) { // this function is called when a keys are pressed on the keyboard
        if(e.target.getAttribute("contenteditable") == "true") { // ignore shortcuts when a field is being edited
            return;
        }

        for (const [action, shortcut] of Object.entries(SHORTCUT_CONFIGS)) { // go over each configured shortcut
            const expectedKeyCode = 'Key' + shortcut.letter.toUpperCase();
            if (e.code === expectedKeyCode &&
                e.altKey === isEnabled(shortcut, 'needsModifierAlt') &&
                e.shiftKey === isEnabled(shortcut, 'needsModifierShift') &&
                e.ctrlKey === isEnabled(shortcut, 'needsModifierCtrl') &&
                e.metaKey === isEnabled(shortcut, 'needsModifierMeta')) { // matched!

                triggerAction(action);
                e.preventDefault();
                return;

            }
        }
    }

    // register the handler function for keyboard events
    addEventListener("keypress", handleEvent);
    addEventListener("keydown", handleEvent);

})();
