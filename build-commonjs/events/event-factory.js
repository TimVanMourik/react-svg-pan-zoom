"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _viewerMouseEvent = _interopRequireDefault(require("./viewer-mouse-event"));

var _viewerTouchEvent = _interopRequireDefault(require("./viewer-touch-event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(originalEvent, matrix, boundingRect) {
  var eventType = originalEvent.type;

  switch (eventType) {
    case "mousemove":
    case "mouseup":
    case "mousedown":
    case "click":
    case "dblclick":
      return new _viewerMouseEvent.default(originalEvent, matrix, boundingRect);

    case "touchstart":
    case "touchmove":
    case "touchend":
    case "touchcancel":
      return new _viewerTouchEvent.default(originalEvent, matrix, boundingRect);

    default:
      throw new Error("".concat(eventType, " not supported"));
  }
}