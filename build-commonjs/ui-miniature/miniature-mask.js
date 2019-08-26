"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _RandomUID = _interopRequireDefault(require("../utils/RandomUID"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixID = 'react-svg-pan-zoom_miniature';

function MiniatureMask(_ref) {
  var SVGViewBoxX = _ref.SVGViewBoxX,
      SVGViewBoxY = _ref.SVGViewBoxY,
      SVGWidth = _ref.SVGWidth,
      SVGHeight = _ref.SVGHeight,
      x1 = _ref.x1,
      y1 = _ref.y1,
      x2 = _ref.x2,
      y2 = _ref.y2,
      zoomToFit = _ref.zoomToFit,
      _uid = _ref._uid;
  var maskID = "".concat(prefixID, "_mask_").concat(_uid);
  return _react.default.createElement("g", null, _react.default.createElement("defs", null, _react.default.createElement("mask", {
    id: maskID
  }, _react.default.createElement("rect", {
    x: SVGViewBoxX,
    y: SVGViewBoxY,
    width: SVGWidth,
    height: SVGHeight,
    fill: "#ffffff"
  }), _react.default.createElement("rect", {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  }))), _react.default.createElement("rect", {
    x: SVGViewBoxX,
    y: SVGViewBoxY,
    width: SVGWidth,
    height: SVGHeight,
    style: {
      stroke: "none",
      fill: "#000",
      mask: "url(#".concat(maskID, ")"),
      opacity: 0.4
    }
  }));
}

MiniatureMask.propTypes = {
  SVGWidth: _propTypes.default.number.isRequired,
  SVGHeight: _propTypes.default.number.isRequired,
  SVGViewBoxX: _propTypes.default.number.isRequired,
  SVGViewBoxY: _propTypes.default.number.isRequired,
  x1: _propTypes.default.number.isRequired,
  y1: _propTypes.default.number.isRequired,
  x2: _propTypes.default.number.isRequired,
  y2: _propTypes.default.number.isRequired,
  zoomToFit: _propTypes.default.number.isRequired
};

var _default = (0, _RandomUID.default)(MiniatureMask);

exports.default = _default;