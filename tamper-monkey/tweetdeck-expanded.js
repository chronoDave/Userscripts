// ==UserScript==
// @name            TweetDeck Home Expand
// @version         1.0
// @description     Better TweetDeck flexing
// @author          Chronocide
// @match           https://tweetdeck.twitter.com/
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/chronoDave/user-scripts/master/tamper-monkey/tweetdeck-expanded.js
// @downloadURL     https://raw.githubusercontent.com/chronoDave/user-scripts/master/tamper-monkey/tweetdeck-expanded.js
// ==/UserScript==

// Utils
const toArray = any => (Array.isArray(any) ? any : [any]);
const appendStyle = (node, styles) => {
  if (node) {
    const style = node.style.cssText;
    node.setAttribute('style', `${style}; ${toArray(styles).join('; ')}`);
  }
};
const setStyle = (selector, styles) => appendStyle(
  document.querySelector(selector),
  styles
);

// Main
const main = () => {
  setStyle(
    '.js-app-columns',
    'display: flex; justify-content: center'
  );
  setStyle(
    'section.js-column:nth-child(1)',
    'width: 600px'
  );
};

let updateInterval = null;
const update = () => {
  const node = document.querySelector('section.js-column:nth-child(1)');

  if (node) {
    main();
    clearInterval(updateInterval);
  }
};

updateInterval = setInterval(update, 100);
