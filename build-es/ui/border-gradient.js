function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT, POSITION_NONE } from '../constants';
import RandomUID from "../utils/RandomUID";
var prefixID = 'react-svg-pan-zoom_border_gradient';

function BorderGradient(_ref) {
  var direction = _ref.direction,
      width = _ref.width,
      height = _ref.height,
      _uid = _ref._uid,
      setAutoPanHover = _ref.setAutoPanHover;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hover = _useState2[0],
      setHover = _useState2[1];

  var transform;

  switch (direction) {
    case POSITION_TOP:
      transform = "translate(".concat(width, ", 0) rotate(90)");
      break;

    case POSITION_RIGHT:
      transform = "translate(".concat(width, ", ").concat(height, ") rotate(180)");
      break;

    case POSITION_BOTTOM:
      transform = "translate(0, ".concat(height, ") rotate(270)");
      break;

    case POSITION_LEFT:
      transform = " ";
      break;
  }

  var gradientID = "".concat(prefixID, "_gradient_").concat(_uid);
  var maskID = "".concat(prefixID, "_mask_").concat(_uid);
  return React.createElement("g", null, React.createElement("defs", null, React.createElement("linearGradient", {
    id: gradientID,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%",
    spreadMethod: "pad"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: "#fff",
    stopOpacity: "0.8"
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: "#000",
    stopOpacity: "0.5"
  })), React.createElement("mask", {
    id: maskID,
    x: "0",
    y: "0",
    width: "20",
    height: Math.max(width, height)
  }, React.createElement("rect", {
    x: "0",
    y: "0",
    width: "20",
    height: Math.max(width, height),
    style: {
      stroke: "none",
      fill: "url(#".concat(gradientID, ")")
    }
  }))), React.createElement("rect", {
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
      setAutoPanHover(POSITION_NONE);
    }
  }));
}

BorderGradient.propTypes = {
  direction: PropTypes.oneOf([POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT]).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
export default RandomUID(BorderGradient);