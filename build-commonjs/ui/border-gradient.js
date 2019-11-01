"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _constants = require("../constants");

var _RandomUID = _interopRequireDefault(require("../utils/RandomUID"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var prefixID = 'react-svg-pan-zoom_border_gradient';

function BorderGradient(_ref) {
  var direction = _ref.direction,
      width = _ref.width,
      height = _ref.height,
      _uid = _ref._uid,
      setAutoPanHover = _ref.setAutoPanHover;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      hover = _useState2[0],
      setHover = _useState2[1];

  var transform;

  switch (direction) {
    case _constants.POSITION_TOP:
      transform = "translate(".concat(width, ", 0) rotate(90)");
      break;

    case _constants.POSITION_RIGHT:
      transform = "translate(".concat(width, ", ").concat(height, ") rotate(180)");
      break;

    case _constants.POSITION_BOTTOM:
      transform = "translate(0, ".concat(height, ") rotate(270)");
      break;

    case _constants.POSITION_LEFT:
      transform = " ";
      break;
  }

  var gradientID = "".concat(prefixID, "_gradient_").concat(_uid);
  var maskID = "".concat(prefixID, "_mask_").concat(_uid);
  return _react.default.createElement("g", null, _react.default.createElement("defs", null, _react.default.createElement("linearGradient", {
    id: gradientID,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%",
    spreadMethod: "pad"
  }, _react.default.createElement("stop", {
    offset: "0%",
    stopColor: "#fff",
    stopOpacity: "0.8"
  }), _react.default.createElement("stop", {
    offset: "100%",
    stopColor: "#000",
    stopOpacity: "0.5"
  })), _react.default.createElement("mask", {
    id: maskID,
    x: "0",
    y: "0",
    width: "20",
    height: Math.max(width, height)
  }, _react.default.createElement("rect", {
    x: "0",
    y: "0",
    width: "20",
    height: Math.max(width, height),
    style: {
      stroke: "none",
      fill: "url(#".concat(gradientID, ")")
    }
  }))), _react.default.createElement("rect", {
    x: "0",
    y: "0",
    width: "20",
    height: Math.max(width, height),
    style: {
      stroke: "none",
      fill: "#000",
      mask: "url(#".concat(maskID, ")"),
      opacity: hover ? 1 : 0
    },
    transform: transform,
    onMouseEnter: function onMouseEnter() {
      setHover(true);
      setAutoPanHover(direction);
    },
    onMouseLeave: function onMouseLeave() {
      setHover(false);
      setAutoPanHover(_constants.POSITION_NONE);
    }
  }));
}

BorderGradient.propTypes = {
  direction: _propTypes.default.oneOf([_constants.POSITION_TOP, _constants.POSITION_RIGHT, _constants.POSITION_BOTTOM, _constants.POSITION_LEFT]).isRequired,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};

var _default = (0, _RandomUID.default)(BorderGradient);

exports.default = _default;