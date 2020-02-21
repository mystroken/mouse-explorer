/**
 * Mouse Explorer.
 * @license see /LICENSE
 */
'use strict';

/**
 * @typedef MouseExplorerParameters
 * @type Object
 * @property {HTMLElement} section The section to be explored.
 * @property {HTMLElement} viewport The viewport that clips the section.
 * @property {Number} ease The ease.
 */
var defaultParameters = {
  ease: 0.21,
  section: null,
  viewport: document,
};

/**
 * @typedef MouseExplorerPosition
 * @property {Number} x The position on x-axis.
 * @property {Number} y The position on y-axis.
 */

/**
 * 
 * @typedef MouseExplorer
 * @type Object
 * @property {Function} on Add a callback to be called on each mouse move on the section.
 * @property {Function} off Remove a callback.
 * @property {Function} position Get position (in pixel) for a given [-1,1] coordinates.
 * @property {Function} coordinates Get [-1,1] coordinates for a given pixel.
 * @property {MouseExplorerPosition} position The position (in pixel) of the section inside the viewport.
 * @property {MouseExplorerPosition} coordinates The position (in [-1, 1] coordinates system) of the section inside the viewport.
 */

/**
 * Create a new mouse explorer instance.
 * @param {MouseExplorerParameters} parameters The mouse explorer parameters.
 * @returns {MouseExplorer}
 */
function createMouseExplorer(parameters) {
  // Get parameters.
  parameters = (typeof parameters !== 'object') ? {} : parameters;
  var ease = parameters.ease || defaultParameters.ease;
  var section = parameters.section || defaultParameters.section;
  var viewport = parameters.viewport || defaultParameters.viewport;
  if (section === null) throw new Error('you must define a valid section !');

  // Variables.
  var listeners = [];
  var initialized = false;

  /**
   * Initialize.
   */
  function initialize() {
    onResize();
    addEvents();
    initialized = true;
  }

  /**
   * Get position (in pixel) for a given [-1,1] coordinates.
   * @param {Number} x The given x-axis position (in pixel);
   * @param {Number} y The given y-axis position (in pixel);
   * @returns {MouseExplorerPosition}
   */
  function positionAt(x, y) {
    return { x: 0, y: 0 };
  }

  /**
   * Get [-1,1] coordinates for a given pixel.
   * @param {Number} x The given x-axis position (in [-1,1]);
   * @param {Number} y The given y-axis position (in [-1,1]);
   * @returns {MouseExplorerPosition}
   */
  function coordinatesAt(x, y) {
    return { x: 0, y: 0 };
  }

  /**
   * Execute on each screen size change.
   */
  function onResize() {
    // Process
    // Compute the new system limit (clamp the position).
  }

  /**
   * Add a callback to be called on each mouse move on the section.
   * @param {Function} callback The function to be called.
   */
  function on(callback) {
    if (!initialized) initialize();
    listeners.push(callback);
  }

  /**
   * Remove the callback.
   * @param {Function} callback The callback to remove.
   */
  function off(callback) {
    listeners.splice(callback, 1);
    if (listeners.length <= 0) destroy();
  }

  /**
   * Add event listeners.
   */
  function addEvents() {
    window.addEventListener('resize', onResize);
  }

  /**
   * Detach event listeners.
   */
  function detachEvents() {
    window.removeEventListener('resize', onResize);
  }

  /**
   * Cleanup.
   */
  function destroy() {
    detachEvents();
    initialized = false;
  }


  return {
    on: on,
    off: off,
    positionAt: positionAt,
    coordinatesAt: coordinatesAt,
    listeners: listeners,
    initialized: initialized
  };
}

module.exports = createMouseExplorer;
