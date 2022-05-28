// ==UserScript==
// @name         TMDB Copy Title
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the streaming world!
// @author       4L00
// @match        https://www.themoviedb.org/movie/*
// @grant        none
// ==/UserScript==

const $ = window.jQuery;

(function() {

    const tmdbid = window.location.href.split("/")[4].split("-")[0];

    const copyButton = document.createElement("button");
    copyButton.id ='copyButton';
    copyButton.innerHTML = '<img src="https://cdn1.iconfinder.com/data/icons/round-icons-vol-2/512/Copy_duplicate-512.png" width="40" height="40"/>';
    copyButton.style.background = 'transparent'
    copyButton.style.border = 'none'
    copyButton.style.outline = 'none'

    const titleContainer = $(".title h2");
    titleContainer.append(copyButton);

    document.getElementById("copyButton").addEventListener("click", function(){
       const movieTitle = titleContainer.children("a").first().text();
       const releaseYear = titleContainer.children(".release_date").text();
       let toCopy = `${movieTitle} ${releaseYear} {tmdb-${tmdbid}}`;
       const illegalChars = /[\/\?\<\>\\\:\*\|\"]/g;
       toCopy = toCopy.replace(illegalChars, "-");
       navigator.clipboard.writeText(toCopy);
    });

})();
