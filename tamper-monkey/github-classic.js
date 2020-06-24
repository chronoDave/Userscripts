// ==UserScript==
// @name            GitHub Classic
// @version         1.1
// @description     CSS injector to replicate pre June 2020 styling.
// @author          Chronocide
// @match           https://github.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/chronoDave/user-scripts/master/tamper-monkey/github-classic.js
// @downloadURL     https://raw.githubusercontent.com/chronoDave/user-scripts/master/tamper-monkey/github-classic.js
// ==/UserScript==

// Helper
function toArray(any) {
  return Array.isArray(any) ? any : [any];
}
function appendStyle(node, styles) {
  if (node) {
    const style = node.style.cssText;
    node.setAttribute('style', `${style}; ${toArray(styles).join('; ')}`);
  }
}
function setStyle(selector, styles) {
  appendStyle(document.querySelector(selector), styles);
}
function setStyleAll(selector, styles) {
  const nodes = document.querySelectorAll(toArray(selector).join());
  for (let i = 0, l = nodes.length; i < l; i += 1) {
    appendStyle(nodes[i], styles);
  }
}

// Main
const main = () => {
  // Button
  setStyleAll([
    '.btn',
    '.social-count',
    '.Box',
    '.Box-header',
    '.Box-body',
    '.Box-row',
    '.Box--responsive',
    '.subnav-item',
    '.topic-tag',
    '.flash'
  ], 'border-radius: 2px !important');
  setStyleAll('.btn', 'padding: 4px 8px !important');

  // Header
  setStyle('.repohead', [
    'border-bottom: 1px solid #e1e4e8 !important',
    'margin-bottom: 16px !important'
  ]);
  setStyle('.repohead .d-flex', [
    'max-width: 1280px',
    'margin: 0px auto !important',
    'padding-bottom: 8px'
  ]);
  setStyle('.repohead .UnderlineNav', [
    'max-width: 1280px',
    'margin: 0px auto !important',
    'box-shadow: initial'
  ]);
  setStyle('.repohead .UnderlineNav .position-absolute', [
    'padding-right: initial !important',
    'position: initial !important'
  ]);
  setStyle('.flash', 'margin-bottom: 8px !important');
  setStyle('.file-navigation', 'margin-bottom: 8px !important');

  // Content
  setStyleAll('.Box-row', 'border-bottom: 1px solid #e1e4e8 !important');
  setStyleAll('.Box-row .flex-auto span a', 'color: #0366d6 !important');
  setStyle('div.Box-row:last-of-type', 'border: initial !important');
  setStyle('.Box-header--blue', 'padding: 8px 12px !important');

  // Article
  setStyle('article', 'max-width: initial');

  // Avatar
  setStyleAll('.avatar-user', 'border-radius: 2px !important');
};

// Update
let previous = null;
const update = () => {
  const current = document.querySelector('body').innerHTML.length;
  if (previous !== current) {
    main();
    previous = current;
  }
};

setInterval(update, 100);
