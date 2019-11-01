function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { ACTION_PAN, MODE_IDLE, MODE_PANNING, NULL_POSITION } from '../constants';
import { getSVGPoint } from './common';
import { fromObject, translate, transform, applyToPoints, inverse } from 'transformation-matrix';
/**
 *
 * @param SVGDeltaX
 * @param SVGDeltaY
 * @param panLimit
 * @returns {Object}
 */

export function pan(initialMatrix, delta, viewer, SVGAttributes) {
  var panLimit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var matrix = transform(fromObject(initialMatrix), //2
  translate(delta.x, delta.y) //1
  ); // apply pan limits

  if (panLimit) {
    var viewerWidth = viewer.viewerWidth,
        viewerHeight = viewer.viewerHeight;
    var SVGMinX = SVGAttributes.SVGMinX,
        SVGMinY = SVGAttributes.SVGMinY,
        SVGWidth = SVGAttributes.SVGWidth,
        SVGHeight = SVGAttributes.SVGHeight;

    var _applyToPoints = applyToPoints(matrix, [{
      x: SVGMinX + panLimit,
      y: SVGMinY + panLimit
    }, {
      x: SVGMinX + SVGWidth - panLimit,
      y: SVGMinY + SVGHeight - panLimit
    }]),
        _applyToPoints2 = _slicedToArray(_applyToPoints, 2),
        _applyToPoints2$ = _applyToPoints2[0],
        x1 = _applyToPoints2$.x,
        y1 = _applyToPoints2$.y,
        _applyToPoints2$2 = _applyToPoints2[1],
        x2 = _applyToPoints2$2.x,
        y2 = _applyToPoints2$2.y; //x limit


    var moveX = 0;
    if (viewerWidth - x1 < 0) moveX = viewerWidth - x1;else if (x2 < 0) moveX = -x2; //y limit

    var moveY = 0;
    if (viewerHeight - y1 < 0) moveY = viewerHeight - y1;else if (y2 < 0) moveY = -y2; //apply limits

    matrix = transform(translate(moveX, moveY), matrix);
  }

  return {
    mode: MODE_IDLE,
    matrix: matrix,
    lastAction: ACTION_PAN
  };
}
export function startPanning(viewer) {
  return {
    mode: MODE_PANNING,
    start: viewer,
    end: viewer,
    last_action: ACTION_PAN
  };
}
export function updatePanning(cursor, start, end, matrix, panLimit, mode, viewer, SVGAttributes) {
  if (mode !== MODE_PANNING) throw new Error('update pan not allowed in this mode ' + mode);
  var startPos = getSVGPoint(end.x, end.y, matrix);
  var endPos = getSVGPoint(cursor.x, cursor.y, matrix);
  var delta = {
    x: endPos.x - startPos.x,
    y: endPos.y - startPos.y
  };
  return _objectSpread({}, pan(matrix, delta, viewer, SVGAttributes, panLimit), {
    mode: MODE_PANNING,
    end: cursor,
    last_action: ACTION_PAN
  });
}
export function stopPanning() {
  return {
    mode: MODE_IDLE,
    start: NULL_POSITION,
    end: NULL_POSITION,
    last_action: ACTION_PAN
  };
}
export function autoPanIfNeeded(viewer, pointer, matrix) {
  var deltaX = 0;
  var deltaY = 0;
  if (pointer.y <= 20) deltaY = 2;
  if (viewer.viewerWidth - pointer.x <= 20) deltaX = -2;
  if (viewer.viewerHeight - pointer.y <= 20) deltaY = -2;
  if (pointer.x <= 20) deltaX = 2;
  deltaX = deltaX / matrix.d;
  deltaY = deltaY / matrix.d;
  return deltaX === 0 && deltaY === 0 ? {} : pan(matrix, {
    x: deltaX,
    y: deltaY
  }, null, viewer);
}