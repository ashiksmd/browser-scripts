// ==UserScript==
// @name         Mouse click page turns on play books
// @namespace    http://userscripts.samad.one/
// @version      0.2
// @description  Right click for next page, left for previous
// @author       You
// @match        https://books.googleusercontent.com/books/reader/frame?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://raw.githubusercontent.com/ashiksmd/browser-scripts/main/mouse-page-turn-gbooks.js
// @updateURL https://raw.githubusercontent.com/ashiksmd/browser-scripts/main/mouse-page-turn-gbooks.js
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

  const toggleButtonClassName = "toggle_full_page_turn_buttons";

  const prevButton = document.createElement("div");
  prevButton.className="bigButton prevButton";
  const nextButton = document.createElement("div");
  nextButton.className="bigButton nextButton";

  function disable() {
      config.fullPageButtonsEnabled = false;
      document.querySelector("." + toggleButtonClassName + " mat-icon").innerHTML = "toggle_off"
      document.getElementsByClassName(toggleButtonClassName).getElementsByTagName("mat-icon").innerHTML = "toggle_off";

      prevButton.className="bigButton prevButton hiddenButton";
      nextButton.className="bigButton nextButton hiddenButton";
  }
  function enable() {
      config.fullPageButtonsEnabled = true;
      document.querySelector("." + toggleButtonClassName + " mat-icon").innerHTML = "toggle_on"

      prevButton.className="bigButton prevButton";
      nextButton.className="bigButton nextButton";
  }

  //enable(); // initial state

  function setup() {
      const onepage = document.querySelector("reader-app .onepage");
      const twopage = document.querySelector("reader-app .twopage");
      const body = onepage || twopage;
      const toolbar = document.querySelector(".nav-group.end");

      if (!body || !toolbar) return false;

      body.appendChild(prevButton);
      body.appendChild(nextButton);

      const toggleButton = toolbar.firstElementChild.cloneNode(true);
      const buttonTitle = "Toggle full page turn buttons";
      toggleButton.setAttribute("aria-label", buttonTitle);
      toggleButton.title = buttonTitle;
      toggleButton.className += " " + toggleButtonClassName;
      toggleButton.getElementsByTagName("mat-icon")[0].innerHTML = "toggle_on";
      toolbar.insertBefore(toggleButton, toolbar.firstElementChild);

      function toggle() {
          if (config.fullPageButtonsEnabled) {
              disable();
          } else {
              enable();
          }
      }

      toggleButton.addEventListener("click", toggle);

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
