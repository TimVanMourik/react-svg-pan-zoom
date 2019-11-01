"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMouseDown = onMouseDown;
exports.onMouseMove = onMouseMove;
exports.onMouseUp = onMouseUp;
exports.onDoubleClick = onDoubleClick;
exports.onWheel = onWheel;
exports.onMouseEnterOrLeave = onMouseEnterOrLeave;

var _constants = require("../constants");

var _common = require("./common");

var _pan = require("./pan");

var _zoom = require("./zoom");

var _mapRange = _interopRequireDefault(require("../utils/mapRange"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function onMouseDown(event, boundingRect, matrix, tool, props, mode) {
  var cursurPosition = (0, _common.getCursorPosition)(event, boundingRect);
  var nextValue = {};

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
      var x = cursurPosition.x,
          y = cursurPosition.y;
      var SVGPoint = (0, _common.getSVGPoint)(x, y, matrix);
      nextValue = (0, _zoom.zoom)(matrix, SVGPoint, 1 / props.scaleFactor);
      break;

    case _constants.TOOL_ZOOM_IN:
      nextValue = (0, _zoom.startZooming)(cursurPosition);
      break;

    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      nextValue = (0, _pan.startPanning)(cursurPosition);
      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}

function onMouseMove(event, boundingRect, matrix, tool, props, mode, start, end, viewer, SVGAttributes) {
  var cursurPosition = (0, _common.getCursorPosition)(event, boundingRect);
  var forceExit = event.buttons === 0; //the mouse exited and reentered into svg

  var nextValue = {};

  switch (tool) {
    case _constants.TOOL_ZOOM_IN:
      if (mode === _constants.MODE_ZOOMING) nextValue = forceExit ? (0, _zoom.stopZooming)(cursurPosition, start, end, matrix, props.scaleFactor, props, viewer) : (0, _zoom.updateZooming)(mode, cursurPosition);
      break;

    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      if (mode === _constants.MODE_PANNING) nextValue = forceExit ? (0, _pan.stopPanning)() : (0, _pan.updatePanning)(cursurPosition, start, end, matrix, props.preventPanOutside ? 20 : undefined, mode, viewer, SVGAttributes);
      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}

function onMouseUp(event, boundingRect, matrix, tool, props, mode, start, end, viewer) {
  var cursurPosition = (0, _common.getCursorPosition)(event, boundingRect);
  var nextValue = {};

  switch (tool) {
    case _constants.TOOL_ZOOM_OUT:
      if (mode === _constants.MODE_ZOOMING) nextValue = (0, _zoom.stopZooming)(cursurPosition, start, end, matrix, 1 / props.scaleFactor, props, viewer);
      break;

    case _constants.TOOL_ZOOM_IN:
      if (mode === _constants.MODE_ZOOMING) nextValue = (0, _zoom.stopZooming)(cursurPosition, start, end, matrix, props.scaleFactor, props, viewer);
      break;

    case _constants.TOOL_AUTO:
    case _constants.TOOL_PAN:
      if (mode === _constants.MODE_PANNING) nextValue = (0, _pan.stopPanning)();
      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}

function onDoubleClick(event, boundingRect, matrix, tool, props, mode) {
  var cursurPosition = (0, _common.getCursorPosition)(event, boundingRect);
  var x = cursurPosition.x,
      y = cursurPosition.y;
  var nextValue = {};

  switch (tool) {
    case _constants.TOOL_AUTO:
      if (!props.disableDoubleClickZoomWithToolAuto) {
        var SVGPoint = (0, _common.getSVGPoint)(x, y);

        var modifierKeysReducer = function modifierKeysReducer(current, modifierKey) {
          return current || event.getModifierState(modifierKey);
        };

        var modifierKeyActive = props.modifierKeys.reduce(modifierKeysReducer, false);
        var scaleFactor = modifierKeyActive ? 1 / props.scaleFactor : props.scaleFactor;
        nextValue = (0, _zoom.zoom)(SVGPoint.x, SVGPoint.y, scaleFactor, props);
      }

      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}

function onWheel(event, boundingRect, matrix, tool, props, mode) {
  var cursurPosition = (0, _common.getCursorPosition)(event, boundingRect);
  var x = cursurPosition.x,
      y = cursurPosition.y;
  if (!props.detectWheel) return {};
  var delta = Math.max(-1, Math.min(1, event.deltaY));
  var scaleFactor = (0, _mapRange.default)(delta, -1, 1, props.scaleFactorOnWheel, 1 / props.scaleFactorOnWheel);
  var SVGPoint = (0, _common.getSVGPoint)(x, y, matrix);
  event.preventDefault();
  return (0, _zoom.zoom)(matrix, SVGPoint, scaleFactor);
}

function onMouseEnterOrLeave(event, boundingRect, matrix, tool, props, mode) {
  event.preventDefault();
  return {
    focus: event.type === 'mouseenter'
  };
}