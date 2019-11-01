"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ToolbarButton = function ToolbarButton(props) {
  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      hover = _useState2[0],
      setHover = _useState2[1];

  function change(event) {
    event.preventDefault();
    event.stopPropagation();

    switch (event.type) {
      case 'mouseenter':
      case 'touchstart':
        setHover(true);
        break;

      case 'mouseleave':
      case 'touchend':
      case 'touchcancel':
        setHover(false);
        break;
    }
  }

  var title = props.title,
      name = props.name,
      active = props.active,
      toolbarPosition = props.toolbarPosition,
      onClick = props.onClick,
      children = props.children;
  var style = {
    display: "block",
    width: "24px",
    height: "24px",
    margin: [_constants.POSITION_TOP, _constants.POSITION_BOTTOM].indexOf(toolbarPosition) >= 0 ? "2px 1px" : "1px 2px",
    color: active || hover ? '#1CA6FC' : '#FFF',
    transition: "color 200ms ease",
    background: "none",
    padding: "0px",
    border: "0px",
    outline: "0px",
    cursor: "pointer"
  };
  return _react.default.createElement("button", {
    onMouseEnter: function onMouseEnter(e) {
      return change(e);
    },
    onMouseLeave: function onMouseLeave(e) {
      return change(e);
    },
    onTouchStart: function onTouchStart(e) {
      change(e);
      onClick(e);
    },
    onTouchEnd: function onTouchEnd(e) {
      return change(e);
    },
    onTouchCancel: function onTouchCancel(e) {
      return change(e);
    },
    onClick: onClick,
    style: style,
    title: title,
    name: name,
    role: "button",
    type: "button"
  }, children);
};

ToolbarButton.propTypes = {
  title: _propTypes.default.string.isRequired,
  name: _propTypes.default.string.isRequired,
  toolbarPosition: _propTypes.default.string.isRequired,
  onClick: _propTypes.default.func.isRequired,
  active: _propTypes.default.bool.isRequired
};
var _default = ToolbarButton;
exports.default = _default;