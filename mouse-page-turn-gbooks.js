// ==UserScript==
// @name         Mouse click page turns on play books
// @namespace    https://books.googleusercontent.com
// @version      0.1
// @description  Right click for next page, left for previous
// @author       You
// @match        https://books.googleusercontent.com/books/reader/frame?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://raw.githubusercontent.com/ashiksmd/browser-scripts/main/tmdb-copy-title.js
// @grant        GM_addStyle
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
            .bigButton {
                 position: fixed;
                 height: 100%;
                 opacity: 0.1;
                 z-index: 100;
            }
            .bigButton:active {
                 background-color: grey !important;
            }
            .nextButton {
                 right: 0;
                 width: 65%;
            }

            .prevButton {
                 left: 0;
                 width: 35%;
            }

            .hiddenButton {
                display: none !important;
            }
    `);

    const config = {
        fullPageButtonsEnabled: true
    };
    const toggleButtonClass = "mat-focus-indicator mat-tooltip-trigger mat-icon-button mat-button-base";
    function getToggleButton(icon) {
        const button = document.createElement("button");
        button.setAttribute("mat-icon-button", true);
        button.setAttribute("title", "Toggle full page turn buttons");
        button.className = toggleButtonClass;
        button.innerHTML = '<span class="mat-button-wrapper"><mat-icon _ngcontent-ngm-c132="" role="img" class="mat-icon notranslate google-material-icons mat-icon-no-color ng-star-inserted" aria-hidden="true" data-mat-icon-type="font">' + icon + '</mat-icon></span>';
        return button;
    }

    const toggleOn = getToggleButton("toggle_on");
    const toggleOff = getToggleButton("toggle_off");

    const prevButton = document.createElement("div");
    prevButton.className="bigButton prevButton";
    const nextButton = document.createElement("div");
    nextButton.className="bigButton nextButton";

    function disable() {
        config.fullPageButtonsEnabled = false;
        toggleOn.className = toggleButtonClass + " hiddenButton";
        toggleOff.className = toggleButtonClass;

        prevButton.className="bigButton prevButton hiddenButton";
        nextButton.className="bigButton nextButton hiddenButton";
    }
    function enable() {
        config.fullPageButtonsEnabled = true;
        toggleOn.className = toggleButtonClass;
        toggleOff.className = toggleButtonClass + " hiddenButton";

        prevButton.className="bigButton prevButton";
        nextButton.className="bigButton nextButton";
    }

    enable(); // initial state

    function setup() {
        const onepage = document.querySelector("reader-main .onepage");
        const twopage = document.querySelector("reader-main .twopage");
        const body = onepage || twopage;
        const toolbar = document.querySelector(".nav-group.end");

        if (!body || !toolbar) return false;

        body.appendChild(prevButton);
        body.appendChild(nextButton);

        toolbar.insertBefore(toggleOn, toolbar.firstChild);
        toolbar.insertBefore(toggleOff, toolbar.firstChild);

        function toggle() {
            if (config.fullPageButtonsEnabled) {
                disable();
            } else {
                enable();
            }
        }

        toggleOn.addEventListener("click", toggle);
        toggleOff.addEventListener("click", toggle);

        prevButton.addEventListener("click", function() {
            if (!config.fullPageButtonsEnabled) return;
            const pageTurnButton = document.querySelectorAll("reader-scrubber button")[0];
            pageTurnButton.click();
        });

        nextButton.addEventListener("click", function() {
            if (!config.fullPageButtonsEnabled) return;
            const pageTurnButton = document.querySelectorAll("reader-scrubber button")[1];
            pageTurnButton.click();
        });

        return true;
    };

    let tryCount = 1;
    function trySetup() {
        console.log(`Setup attempt ${tryCount++}`);
        const result = setup();
        if (result) {
            console.log("Setup successful");
        } else if (tryCount < 30 ) {
            setTimeout(trySetup, 1000);
        } else {
            alert("Unable to setup page turns");
        }
    }
    setTimeout(trySetup, 1000);
})();
