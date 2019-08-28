"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultValue = getDefaultValue;
exports.set = set;
exports.isValueValid = isValueValid;
exports.getSVGPoint = getSVGPoint;
exports.decompose = decompose;
exports.setFocus = setFocus;
exports.setViewerSize = setViewerSize;
exports.setSVGViewBox = setSVGViewBox;
exports.setZoomLevels = setZoomLevels;
exports.setPointOnViewerCenter = setPointOnViewerCenter;
exports.reset = reset;
exports.resetMode = resetMode;

var _constants = require("../constants");

var _transformationMatrix = require("transformation-matrix");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Obtain default value
 * @returns {Object}
 */
function getDefaultValue(viewerWidth, viewerHeight, SVGViewBoxX, SVGViewBoxY, SVGWidth, SVGHeight, scaleFactorMin, scaleFactorMax) {
  return set({}, _objectSpread({}, (0, _transformationMatrix.identity)(), {
    version: 2,
    mode: _constants.MODE_IDLE,
    focus: false,
    pinchPointDistance: null,
    prePinchMode: null,
    viewerWidth: viewerWidth,
    viewerHeight: viewerHeight,
    SVGViewBoxX: SVGViewBoxX,
    SVGViewBoxY: SVGViewBoxY,
    SVGWidth: SVGWidth,
    SVGHeight: SVGHeight,
    scaleFactorMin: scaleFactorMin,
    scaleFactorMax: scaleFactorMax,
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    miniatureOpen: true,
    lastAction: null
  }));
}
/**
 * Change value
 * @param value
 * @param change
 * @param action
 * @returns {Object}
 */


function set(value, change) {
  var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  value = Object.assign({}, value, change, {
    lastAction: action
  });
  return Object.freeze(value);
}
/**
 * value valid check
 * @param value
 */


function isValueValid(value) {
  return value !== null && _typeof(value) === 'object' && value.hasOwnProperty('version');
}
/**
 * Export x,y coords relative to SVG
 * @param value
 * @param viewerX
 * @param viewerY
 * @returns {*|{x, y}|{x: number, y: number}}
 */


function getSVGPoint(value, viewerX, viewerY) {
  var matrix = (0, _transformationMatrix.fromObject)(value);
  var inverseMatrix = (0, _transformationMatrix.inverse)(matrix);
  return (0, _transformationMatrix.applyToPoint)(inverseMatrix, {
    x: viewerX,
    y: viewerY
  });
}
/**
 * Decompose matrix from value
 * @param value
 * @returns {{scaleFactor: number, translationX: number, translationY: number}}
 */


function decompose(value) {
  var matrix = (0, _transformationMatrix.fromObject)(value);
  return {
    scaleFactor: matrix.a,
    translationX: matrix.e,
    translationY: matrix.f
  };
}
/**
 *
 * @param value
 * @param focus
 * @returns {Object}
 */


function setFocus(value, focus) {
  return set(value, {
    focus: focus
  });
}
/**
 *
 * @param value
 * @param viewerWidth
 * @param viewerHeight
 * @returns {Object}
 */


function setViewerSize(value, viewerWidth, viewerHeight) {
  return set(value, {
    viewerWidth: viewerWidth,
    viewerHeight: viewerHeight
  });
}
/**
 *
 * @param value
 * @param SVGViewBoxX
 * @param SVGViewBoxY
 * @param SVGWidth
 * @param SVGHeight
 * @returns {Object}
 */


function setSVGViewBox(value, SVGViewBoxX, SVGViewBoxY, SVGWidth, SVGHeight) {
  return set(value, {
    SVGViewBoxX: SVGViewBoxX,
    SVGViewBoxY: SVGViewBoxY,
    SVGWidth: SVGWidth,
    SVGHeight: SVGHeight
  });
}
/**
 *
 * @param value
 * @param scaleFactorMin
 * @param scaleFactorMax
 * @returns {Object}
 */


function setZoomLevels(value, scaleFactorMin, scaleFactorMax) {
  return set(value, {
    scaleFactorMin: scaleFactorMin,
    scaleFactorMax: scaleFactorMax
  });
}
/**
 *
 * @param value
 * @param SVGPointX
 * @param SVGPointY
 * @param zoomLevel
 * @returns {Object}
 */


function setPointOnViewerCenter(value, SVGPointX, SVGPointY, zoomLevel) {
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;
  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.translate)(-SVGPointX + viewerWidth / 2, -SVGPointY + viewerHeight / 2), //4
  (0, _transformationMatrix.translate)(SVGPointX, SVGPointY), //3
  (0, _transformationMatrix.scale)(zoomLevel, zoomLevel), //2
  (0, _transformationMatrix.translate)(-SVGPointX, -SVGPointY) //1
  );
  return set(value, _objectSpread({
    mode: _constants.MODE_IDLE
  }, matrix));
}
/**
 *
 * @param value
 * @returns {Object}
 */


function reset(value) {
  return set(value, _objectSpread({
    mode: _constants.MODE_IDLE
  }, (0, _transformationMatrix.identity)()));
}
/**
 *
 * @param value
 * @returns {Object}
 */


function resetMode(value) {
  return set(value, {
    mode: _constants.MODE_IDLE,
    startX: null,
    startY: null,
    endX: null,
    endY: null
  });
}