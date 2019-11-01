"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onTouchStart = onTouchStart;
exports.onTouchMove = onTouchMove;
exports.onTouchEnd = onTouchEnd;
exports.onTouchCancel = onTouchCancel;

var _transformationMatrix = require("transformation-matrix");

var _constants = require("../constants");

var _common = require("./common");

var _interactions = require("./interactions");

var _zoom = require("./zoom");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function hasPinchPointDistance(pinchPointDistance) {
  return typeof pinchPointDistance === 'number';
}

function onMultiTouch(event, boundingRect, matrix, tool, props, mode, prePinchMode) {
  var left = boundingRect.left,
      top = boundingRect.top;
  var x1 = event.touches[0].clientX - Math.round(left);
  var y1 = event.touches[0].clientY - Math.round(top);
  var x2 = event.touches[1].clientX - Math.round(left);
  var y2 = event.touches[1].clientY - Math.round(top);
  var thisPinchPointDistance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  var previousPointDistance = hasPinchPointDistance(pinchPointDistance) ? pinchPointDistance : thisPinchPointDistance;
  var svgPoint = (0, _common.getSVGPoint)((x1 + x2) / 2, (y1 + y2) / 2, matrix);
  var distanceFactor = pinchPointDistance / previousPointDistance;

  if ((0, _zoom.isZoomLevelGoingOutOfBounds)(distanceFactor)) {
    return {};
  }

  if (event.cancelable) {
    event.preventDefault();
  }

  var newMatrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.fromObject)(matrix), (0, _transformationMatrix.translate)(svgPoint.x, svgPoint.y), (0, _transformationMatrix.scale)(distanceFactor, distanceFactor), (0, _transformationMatrix.translate)(-svgPoint.x, -svgPoint.y));
  return _objectSpread({
    mode: _constants.MODE_ZOOMING
  }, (0, _zoom.limitZoomLevel)(newMatrix), {
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    prePinchMode: prePinchMode ? prePinchMode : mode,
    pinchPointDistance: pinchPointDistance
  });
}

function isMultiTouch(event, props) {
  return props.detectPinchGesture && event.touches.length > 1;
}

function shouldResetPinchPointDistance(event, pinchPointDistance, props) {
  return props.detectPinchGesture && hasPinchPointDistance(pinchPointDistance) && event.touches.length < 2;
}

function getTouchPosition(touch, boundingRect) {
  var left = boundingRect.left,
      top = boundingRect.top;
  var x = touch.clientX - Math.round(left);
  var y = touch.clientY - Math.round(top);
  return {
    x: x,
    y: y
  };
}

function getNextValue(event, boundingRect, matrix, tool, props, mode, prePinchMode, nextValueFn) {
  var nextValue = event.touches.length === 0 ? {
    mode: prePinchMode ? _constants.MODE_IDLE : mode,
    prePinchMode: null
  } : {};
  var touch = event.touches.length > 0 ? event.touches[0] : event.changedTouches[0];
  var touchPosition = getTouchPosition(touch, boundingRect);

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
    case _constants.TOOL_ZOOM_IN:
    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      event.stopPropagation();
      event.preventDefault();
      return nextValueFn(event, boundingRect, tool, nextValue, props, touchPosition);

    default:
      return nextValue;
  }
}

function onTouchStart(event, boundingRect, matrix, tool, props, mode) {
  if (isMultiTouch(event, props)) {
    return onMultiTouch(event, boundingRect, tool, props);
  }

  if (event.touches.length !== 1) {
    if ([_constants.MODE_PANNING, _constants.MODE_ZOOMING].indexOf(mode) >= 0) {
      return (0, _common.resetMode)();
    } else if ([_constants.MODE_IDLE].indexOf(mode) >= 0) {
      return {};
    }
  }

  return getNextValue(event, boundingRect, tool, props, _interactions.onMouseDown);
}

function onTouchMove(event, boundingRect, matrix, tool, props, mode) {
  if (isMultiTouch(event, props)) {
    return onMultiTouch(event, boundingRect, tool, props);
  }

  if (!([_constants.MODE_PANNING, _constants.MODE_ZOOMING].indexOf(mode) >= 0)) {
    return {};
  }

  return getNextValue(event, boundingRect, tool, props, _interactions.onMouseMove);
}

function onTouchEnd(event, boundingRect, matrix, tool, props, mode, pinchPointDistance) {
  if (!([_constants.MODE_PANNING, _constants.MODE_ZOOMING].indexOf(mode) >= 0)) {
    return {};
  }

  var nextValue = shouldResetPinchPointDistance(event, pinchPointDistance, props) ? {
    pinchPointDistance: null
  } : {};

  if (event.touches.length > 0) {
    return nextValue;
  }

  return getNextValue(event, boundingRect, tool, nextValue, props, _interactions.onMouseUp);
}

function onTouchCancel(event, boundingRect, tool, props) {
  event.stopPropagation();
  event.preventDefault();
  return (0, _common.resetMode)();
}