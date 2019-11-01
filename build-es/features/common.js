import { TOOL_NONE, MODE_IDLE, NULL_POSITION } from '../constants';
import { identity, fromObject, inverse, applyToPoint, transform, translate, scale } from 'transformation-matrix';
/**
 * Export x,y coords relative to SVG
 * @param x
 * @param y
 * @param matrix
 * @returns {*|{x, y}|{x: number, y: number}}
 */

export function getSVGPoint(x, y) {
  var matrix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : identity();
  return applyToPoint(inverse(matrix), {
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

export function getCursorPosition(event, boundingRect) {
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

export function decompose(matrix) {
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

export function setPointOnViewerCenter(viewerWidth, viewerHeight, SVGPointX, SVGPointY, zoomLevel) {
  var matrix = transform(translate(-SVGPointX + viewerWidth / 2, -SVGPointY + viewerHeight / 2), //4
  translate(SVGPointX, SVGPointY), //3
  scale(zoomLevel, zoomLevel), //2
  translate(-SVGPointX, -SVGPointY) //1
  );
  return {
    mode: MODE_IDLE,
    matrix: matrix
  };
}
/**
 *
 * @returns {Object}
 */

export function reset() {
  return {
    mode: MODE_IDLE,
    matrix: identity()
  };
}
/**
 *
 * @returns {Object}
 */

export function resetMode() {
  return {
    mode: MODE_IDLE,
    start: NULL_POSITION,
    end: NULL_POSITION
  };
}