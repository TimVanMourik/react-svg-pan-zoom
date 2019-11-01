"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSVGPoint = getSVGPoint;
exports.getCursorPosition = getCursorPosition;
exports.decompose = decompose;
exports.setPointOnViewerCenter = setPointOnViewerCenter;
exports.reset = reset;
exports.resetMode = resetMode;

var _constants = require("../constants");

var _transformationMatrix = require("transformation-matrix");

/**
 * Export x,y coords relative to SVG
 * @param x
 * @param y
 * @param matrix
 * @returns {*|{x, y}|{x: number, y: number}}
 */
function getSVGPoint(x, y) {
  var matrix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _transformationMatrix.identity)();
  return (0, _transformationMatrix.applyToPoint)((0, _transformationMatrix.inverse)(matrix), {
    x: x,
    y: y
  });
}
/**
 * Export x,y coords relative to SVG
 * @param event
 * @param boundingRect
 * @returns {*|{x, y}|{x: number, y: number}}
 */


function getCursorPosition(event, boundingRect) {
  var left = boundingRect.left,
      top = boundingRect.top;
  var x = event.clientX - Math.round(left);
  var y = event.clientY - Math.round(top);
  return {
    x: x,
    y: y
  };
}
/**
 * Decompose matrix to scale and translate
 * @param matrix
 * @returns {{scaleFactor: number, translationX: number, translationY: number}}
 */


function decompose(matrix) {
  return {
    scaleFactor: matrix.a,
    translationX: matrix.e,
    translationY: matrix.f
  };
}
/**
 * @param viewerWidth
 * @param viewerHeight
 * @param SVGPointX
 * @param SVGPointY
 * @param zoomLevel
 * @returns {Object}
 */


function setPointOnViewerCenter(viewerWidth, viewerHeight, SVGPointX, SVGPointY, zoomLevel) {
  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.translate)(-SVGPointX + viewerWidth / 2, -SVGPointY + viewerHeight / 2), //4
  (0, _transformationMatrix.translate)(SVGPointX, SVGPointY), //3
  (0, _transformationMatrix.scale)(zoomLevel, zoomLevel), //2
  (0, _transformationMatrix.translate)(-SVGPointX, -SVGPointY) //1
  );
  return {
    mode: _constants.MODE_IDLE,
    matrix: matrix
  };
}
/**
 *
 * @returns {Object}
 */


function reset() {
  return {
    mode: _constants.MODE_IDLE,
    matrix: (0, _transformationMatrix.identity)()
  };
}
/**
 *
 * @returns {Object}
 */


function resetMode() {
  return {
    mode: _constants.MODE_IDLE,
    start: _constants.NULL_POSITION,
    end: _constants.NULL_POSITION
  };
}