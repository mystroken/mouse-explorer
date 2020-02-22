/**
 * Mouse Explorer.
 * @license see /LICENSE
 */
'use strict';

/**
 * @typedef MouseExplorerParameters
 * @type Object
 * @property {HTMLElement} section The section to be explored.
 * @property {HTMLElement|Window} viewport The viewport that clips the section.
 * @property {Number} ease The ease of movement (section moving inside the viewport).
 * @property {Boolean} center Center or not the section on start.
 */
var defaultParameters = {
  ease: 0.21,
  section: null,
  viewport: window,
  center: false
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
 * @property {Function} positionAt Get position (in pixel) for a given [-1,1] coordinates.
 * @property {MouseExplorerPosition} position The position (in pixel) of the section inside the viewport.
 */
 
/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @param {number} number The number to clamp.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function clamp(number, lower, upper) {
  return Math.min(Math.max(number, lower), upper);
}

/**
 * Linear interpolation
 *
 * Interpolates from start to end using the given fraction.
 *
 * @param {Number} s The min value.
 * @param {Number} e The max value.
 * @param {Number} f The fraction (from 0 to 1)
 * @returns {Number}
 */
function lerp(s, e, f) {
  return (e - s) * f + s;
}

/**
 * Round
 *
 * Round a number with a p precision
 *
 * @param {Number} n The number to round.
 * @param {Number} p The precision (decimal length). Default 2
 * @returns {number}
 */
function round(n, p) {
  var p = (typeof p === 'undefined') ? 100 : Math.pow(10, p);
  return Math.round(n * p) / p;
}

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
  var shouldCenterSection = parameters.center || defaultParameters.center;
  if (section === null) throw new Error('you must define a valid section !');

  // Variables.
  var instance;
  var lastX = 0;
  var lastY = 0;
  var targetX = 0;
  var targetY = 0;
  var currentX = 0;
  var currentY = 0;
  var limitX = 0;
  var limitY = 0;
  var listeners = [];
  var numListeners = 0;
  var initialized = false;
  var rAF = { id: null, ticking: false };
  var bounds = {
    section: { width: 0, height: 0 },
    viewport: { width: 0, height: 0 }
  };

  /**
   * Initialize.
   */
  function initialize() {
    onResize();
    addEvents();
    if (shouldCenterSection) {
      var centerPosition = positionAt(0, 0);
      currentX = targetX = centerPosition.x;
      currentY = targetY = centerPosition.y;
    }
    initialized = true;
    if (rAF.ticking === false) rAF.id = requestAnimationFrame(runLoop);
  }

  /**
   * Run a loop to compute 
   * position and notify listeners.
   */
  function runLoop() {
    rAF.ticking = true;

    // Compute.
    currentX = round(lerp(currentX, targetX, ease), 3);
    currentY = round(lerp(currentY, targetY, ease), 3);

    // If the current value is equal to the last one,
    // This means that we don't need anymore to run the loop.
    if (
      currentX === lastX 
      && currentY === lastY) {
      rAF.id = cancelAnimationFrame(runLoop);
      rAF.ticking = false;
    } else { rAF.id = requestAnimationFrame(runLoop); }

    // Notify listeners.
    for(var i=0; i < numListeners; i++)
      listeners[i]({ x: currentX, y: currentY });

    // Keep track of the last value.
    lastX = currentX;
    lastY = currentY;
  }

  /**
   * Compute the position according
   * to the mouse position.
   * @param {MouseEvent} event 
   */
  function calc(event) {
    targetX = -1 * event.pageX * ((bounds.section.width / bounds.viewport.width) - 1);
    targetY = -1 * event.pageY * ((bounds.section.height / bounds.viewport.height) - 1);
    clampTarget();
    if (rAF.ticking === false) rAF.id = requestAnimationFrame(runLoop);
  }

  /**
   * Defines bounds of our position system.
   */
  function clampTarget() {
    targetX = clamp(targetX, limitX, 0);
    targetY = clamp(targetY, limitY, 0);
  }

  /**
   * Execute on each screen size change.
   */
  function onResize() {
    // Process
    // Get elements new dimensions
    // Compute the new system limit (clamp the position).
    var sectionClientRect = typeof section.getBoundingClientRect === 'function'
      ? section.getBoundingClientRect() : { width: 0, height: 0};
    var viewportClientRect = viewport.innerWidth !== undefined
      ? { width: viewport.innerWidth, height: viewport.innerHeight } 
      : viewport.getBoundingClientRect();
    
    bounds.viewport.width = viewportClientRect.width;
    bounds.viewport.height = viewportClientRect.height;
    bounds.section.width = sectionClientRect.width;
    bounds.section.height = sectionClientRect.height;

    // Compute limit.
    limitX = -1 * (bounds.section.width - bounds.viewport.width);
    limitY = -1 * (bounds.section.height - bounds.viewport.height);

    // Limit the position with new bounds.
    clampTarget();
    if (rAF.ticking === false) rAF.id = requestAnimationFrame(runLoop);
  }

  /**
   * Add a callback to be called on each mouse move on the section.
   * @param {Function} callback The function to be called.
   */
  function on(callback) {
    if (!initialized) initialize();
    listeners.push(callback);
    numListeners = listeners.length;
  }

  /**
   * Remove the callback.
   * @param {Function} callback The callback to remove.
   */
  function off(callback) {
    listeners.splice(callback, 1);
    numListeners = listeners.length;
    if (numListeners <= 0) destroy();
  }

  /**
   * Add event listeners.
   */
  function addEvents() {
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', calc);
  }

  /**
   * Detach event listeners.
   */
  function detachEvents() {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', calc);
  }

  /**
   * Cleanup.
   */
  function destroy() {
    rAF.id = cancelAnimationFrame(runLoop);
    detachEvents();
    initialized = false;
  }

  /**
   * Get position (in pixel) for a given [-1,1] coordinates.
   * @param {Number} x The given x-axis position (in pixel);
   * @param {Number} y The given y-axis position (in pixel);
   * @returns {MouseExplorerPosition}
   */
  function positionAt(x, y) {
    x = clamp(x, -1, 1);
    y = clamp(y, -1, 1);

    // -1 => 0
    // 0 => limit / 2
    // 1 => limit

    return { 
      x: ((x * limitX) + limitX) / 2, 
      y: ((y * limitY) + limitY) / 2
    };
  }
  
  onResize();

  instance = {
    on: on,
    off: off,
    positionAt: positionAt
  };

  Object.defineProperties(instance, {
    position: {
      get: function() {
        return { x: currentX, y: currentY };
      }
    }
  });

  return instance;
}

module.exports = createMouseExplorer;
