function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React from 'react';
import PropTypes from 'prop-types';
import { POSITION_LEFT, POSITION_RIGHT } from '../constants';
import { applyToPoints, inverse } from 'transformation-matrix';
import MiniatureToggleButton from './miniature-toggle-button';
import MiniatureMask from './miniature-mask';
var min = Math.min,
    max = Math.max;
export default function Miniature(props) {
  var _style;

  var miniatureOpen = props.miniatureOpen,
      setMiniatureOpen = props.setMiniatureOpen,
      matrix = props.matrix,
      onChangeValue = props.onChangeValue,
      children = props.children,
      position = props.position,
      background = props.background,
      SVGBackground = props.SVGBackground,
      miniatureWidth = props.width,
      miniatureHeight = props.height;
  var _props$viewer = props.viewer,
      viewerWidth = _props$viewer.viewerWidth,
      viewerHeight = _props$viewer.viewerHeight;
  var _props$SVGAttributes = props.SVGAttributes,
      SVGMinX = _props$SVGAttributes.SVGMinX,
      SVGMinY = _props$SVGAttributes.SVGMinY,
      SVGWidth = _props$SVGAttributes.SVGWidth,
      SVGHeight = _props$SVGAttributes.SVGHeight;
  var ratio = SVGHeight / SVGWidth;
  var zoomToFit = ratio >= 1 ? miniatureHeight / SVGHeight : miniatureWidth / SVGWidth;

  var _applyToPoints = applyToPoints(inverse(matrix), [{
    x: 0,
    y: 0
  }, {
    x: viewerWidth,
    y: viewerHeight
  }]),
      _applyToPoints2 = _slicedToArray(_applyToPoints, 2),
      _applyToPoints2$ = _applyToPoints2[0],
      x1 = _applyToPoints2$.x,
      y1 = _applyToPoints2$.y,
      _applyToPoints2$2 = _applyToPoints2[1],
      x2 = _applyToPoints2$2.x,
      y2 = _applyToPoints2$2.y;

  var width, height;

  if (miniatureOpen) {
    width = miniatureWidth;
    height = miniatureHeight;
  } else {
    width = 24;
    height = 24;
  }

  var style = (_style = {
    position: "absolute",
    overflow: "hidden",
    outline: "1px solid rgba(19, 20, 22, 0.90)",
    transition: "width 200ms ease, height 200ms ease, bottom 200ms ease",
    width: width + "px",
    height: height + "px",
    bottom: "6px"
  }, _defineProperty(_style, position === POSITION_LEFT ? 'left' : 'right', "6px"), _defineProperty(_style, "background", background), _style);
  var centerTranslation = ratio >= 1 ? "translate(".concat((miniatureWidth - SVGWidth * zoomToFit) / 2 - SVGMinX * zoomToFit, ", ").concat(-SVGMinY * zoomToFit, ")") : "translate(".concat(-SVGMinX * zoomToFit, ", ").concat((miniatureHeight - SVGHeight * zoomToFit) / 2 - SVGMinY * zoomToFit, ")");
  return React.createElement("div", {
    role: "navigation",
    style: style
  }, React.createElement("svg", {
    width: miniatureWidth,
    height: miniatureHeight,
    style: {
      pointerEvents: "none"
    }
  }, React.createElement("g", {
    transform: centerTranslation
  }, React.createElement("g", {
    transform: "scale(".concat(zoomToFit, ", ").concat(zoomToFit, ")")
  }, React.createElement("rect", {
    fill: SVGBackground,
    x: SVGMinX,
    y: SVGMinY,
    width: SVGWidth,
    height: SVGHeight
  }), children, React.createElement(MiniatureMask, {
    SVGWidth: SVGWidth,
    SVGHeight: SVGHeight,
    SVGMinX: SVGMinX,
    SVGMinY: SVGMinY,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    zoomToFit: zoomToFit
  })))), React.createElement(MiniatureToggleButton, {
    miniatureOpen: miniatureOpen,
    setMiniatureOpen: setMiniatureOpen,
    position: position
  }));
}
Miniature.propTypes = {
  // onChangeValue: PropTypes.func.isRequired,
  SVGBackground: PropTypes.string.isRequired,
  //customizations
  position: PropTypes.oneOf([POSITION_RIGHT, POSITION_LEFT]),
  background: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
Miniature.defaultProps = {
  position: POSITION_LEFT,
  background: "#616264",
  width: 100,
  height: 80
};