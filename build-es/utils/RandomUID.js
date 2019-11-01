function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState } from "react";
import getDisplayName from "./getDisplayName";
var uid = 1;

var nextUID = function nextUID() {
  return "uid".concat(uid++);
};

export default function RandomUID(WrappedComponent) {
  var RandomUID = function RandomUID(props) {
    var _useState = useState(nextUID()),
        _useState2 = _slicedToArray(_useState, 2),
        uid = _useState2[0],
        setUID = _useState2[1];

    return React.createElement(WrappedComponent, _extends({
      _uid: uid
    }, props));
  };

  RandomUID.displayName = "RandomUID(".concat(getDisplayName(WrappedComponent), ")");
  return RandomUID;
}