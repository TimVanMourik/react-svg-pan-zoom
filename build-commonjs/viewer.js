"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _transformationMatrix = require("transformation-matrix");

var _eventFactory = _interopRequireDefault(require("./events/event-factory"));

var _pan2 = require("./features/pan");

var _common = require("./features/common");

var _interactions = require("./features/interactions");

var _ViewBoxParser = _interopRequireDefault(require("./utils/ViewBoxParser"));

var _is = require("./utils/is");

var _interactionsTouch = require("./features/interactions-touch");

var _zoom2 = require("./features/zoom");

var _miniature = require("./features/miniature");

var _cursorPolyfill = _interopRequireDefault(require("./ui/cursor-polyfill"));

var _borderGradient = _interopRequireDefault(require("./ui/border-gradient"));

var _selection = _interopRequireDefault(require("./ui/selection"));

var _toolbar = _interopRequireDefault(require("./ui-toolbar/toolbar"));

var _detectTouch = _interopRequireDefault(require("./ui/detect-touch"));

var _miniature2 = _interopRequireDefault(require("./ui-miniature/miniature"));

var _constants = require("./constants");

var _migrationTips = require("./migration-tips");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ReactSVGPanZoom = (0, _react.forwardRef)(function (props, Viewer) {
  if (process.env.NODE_ENV !== 'production') {
    (0, _migrationTips.printMigrationTipsRelatedToProps)(props);
  }

  var viewerWidth = props.width,
      viewerHeight = props.height,
      scaleFactorMin = props.scaleFactorMin,
      scaleFactorMax = props.scaleFactorMax,
      children = props.children;
  var viewer = {
    viewerWidth: viewerWidth,
    viewerHeight: viewerHeight
  };

  var _useState = (0, _react.useState)(true),
      _useState2 = _slicedToArray(_useState, 2),
      autoPanIsRunning = _useState2[0],
      setAutoPanning = _useState2[1];

  var _useState3 = (0, _react.useState)(_constants.POSITION_NONE),
      _useState4 = _slicedToArray(_useState3, 2),
      autoPanHover = _useState4[0],
      setAutoPanHover = _useState4[1];

  var _useState5 = (0, _react.useState)(_constants.TOOL_AUTO),
      _useState6 = _slicedToArray(_useState5, 2),
      tool = _useState6[0],
      setTool = _useState6[1];

  var _useState7 = (0, _react.useState)((0, _transformationMatrix.identity)()),
      _useState8 = _slicedToArray(_useState7, 2),
      matrix = _useState8[0],
      setMatrix = _useState8[1];

  var _useState9 = (0, _react.useState)(_constants.NULL_POSITION),
      _useState10 = _slicedToArray(_useState9, 2),
      start = _useState10[0],
      setStart = _useState10[1];

  var _useState11 = (0, _react.useState)(_constants.NULL_POSITION),
      _useState12 = _slicedToArray(_useState11, 2),
      end = _useState12[0],
      setEnd = _useState12[1];

  var _useState13 = (0, _react.useState)(_constants.MODE_IDLE),
      _useState14 = _slicedToArray(_useState13, 2),
      mode = _useState14[0],
      setMode = _useState14[1];

  var _useState15 = (0, _react.useState)(false),
      _useState16 = _slicedToArray(_useState15, 2),
      focus = _useState16[0],
      setFocus = _useState16[1];

  var _useState17 = (0, _react.useState)(null),
      _useState18 = _slicedToArray(_useState17, 2),
      pinchPointDistance = _useState18[0],
      setPinchPointDistance = _useState18[1];

  var _useState19 = (0, _react.useState)(null),
      _useState20 = _slicedToArray(_useState19, 2),
      prePinchMode = _useState20[0],
      setPrePinchMode = _useState20[1];

  var _useState21 = (0, _react.useState)(true),
      _useState22 = _slicedToArray(_useState21, 2),
      miniatureOpen = _useState22[0],
      setMiniatureOpen = _useState22[1];

  var _useState23 = (0, _react.useState)(null),
      _useState24 = _slicedToArray(_useState23, 2),
      lastAction = _useState24[0],
      setLastAction = _useState24[1];

  var ViewerDOM = (0, _react.useRef)(null);
  var boundingRect = ViewerDOM.current && ViewerDOM.current.getBoundingClientRect();
  var SVGViewBox = children.props.viewBox;

  var _ref = SVGViewBox ? (0, _ViewBoxParser.default)(SVGViewBox) : {
    SVGHeight: children.props.height,
    SVGWidth: children.props.width,
    SVGMinX: 0,
    SVGMinY: 0
  },
      SVGMinX = _ref.SVGMinX,
      SVGMinY = _ref.SVGMinY,
      SVGWidth = _ref.SVGWidth,
      SVGHeight = _ref.SVGHeight;

  var SVGAttributes = {
    SVGMinX: SVGMinX,
    SVGMinY: SVGMinY,
    SVGWidth: SVGWidth,
    SVGHeight: SVGHeight
  };
  var hoverBorderRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    hoverBorderRef.current = requestAnimationFrame(function () {
      return panOnHover(matrix);
    });
    return function () {
      return cancelAnimationFrame(hoverBorderRef.current);
    };
  }, [autoPanHover]);

  var panOnHover = function panOnHover(inputMatrix) {
    var deltaX = 0;
    var deltaY = 0;

    if (autoPanHover === _constants.POSITION_NONE) {
      cancelAnimationFrame(hoverBorderRef.current);
    } else {
      switch (autoPanHover) {
        case _constants.POSITION_TOP:
          deltaY = -2;
          break;

        case _constants.POSITION_RIGHT:
          deltaX = 2;
          break;

        case _constants.POSITION_BOTTOM:
          deltaY = 2;
          break;

        case _constants.POSITION_LEFT:
          deltaX = -2;
          break;
      }

      var delta = {
        x: deltaX / inputMatrix.d,
        y: deltaY / inputMatrix.d
      };
      var nextValue = (0, _pan2.pan)(inputMatrix, delta, viewer, SVGAttributes, props.preventPanOutside ? 20 : undefined);
      updateValue(nextValue);
      hoverBorderRef.current = requestAnimationFrame(function () {
        return panOnHover(nextValue.matrix);
      });
    }
  }; // on value change


  (0, _react.useEffect)(function () {
    var onChangeValue = props.onChangeValue,
        onZoom = props.onZoom,
        onPan = props.onPan;
    var nextValue = getValue();
    if (onChangeValue) onChangeValue(nextValue);

    if (nextValue.lastAction) {
      if (onZoom && nextValue.lastAction === _constants.ACTION_ZOOM) onZoom(nextValue);
      if (onPan && nextValue.lastAction === _constants.ACTION_PAN) onPan(nextValue);
    }
  }, [matrix, start, end, mode, focus, pinchPointDistance, prePinchMode, miniatureOpen, lastAction]);

  function getValue() {
    return {
      //directly from props:
      viewerWidth: viewerWidth,
      viewerHeight: viewerHeight,
      scaleFactorMin: scaleFactorMin,
      scaleFactorMax: scaleFactorMax,
      //from child props:
      SVGAttributes: SVGAttributes,
      //
      matrix: matrix,
      start: start,
      end: end,
      //
      mode: mode,
      focus: focus,
      pinchPointDistance: pinchPointDistance,
      prePinchMode: prePinchMode,
      miniatureOpen: miniatureOpen,
      lastAction: lastAction,
      //
      version: 3
    };
  }

  function updateValue(nextValue) {
    var matrix = nextValue.matrix,
        start = nextValue.start,
        end = nextValue.end,
        mode = nextValue.mode,
        lastAction = nextValue.lastAction,
        miniatureOpen = nextValue.miniatureOpen;
    if ('matrix' in nextValue) setMatrix(matrix);
    if ('start' in nextValue) setStart(start);
    if ('end' in nextValue) setEnd(end);
    if ('mode' in nextValue) setMode(mode);
    if ('focus' in nextValue) setFocus(focus);
    if ('lastAction' in nextValue) setLastAction(lastAction);
    if ('miniatureOpen' in nextValue) setMiniatureOpen(miniatureOpen);
    var onChangeValue = props.onChangeValue;
    if (onChangeValue) onChangeValue(getValue());
  }
  /** ReactSVGPanZoom methods **/


  (0, _react.useImperativeHandle)(Viewer, function () {
    return {
      pan: function pan(SVGDeltaX, SVGDeltaY) {
        var nextValue = (0, _pan2.pan)(matrix, {
          x: SVGDeltaX,
          y: SVGDeltaY
        }, viewer, SVGAttributes, props.preventPanOutside ? 20 : undefined);
        updateValue(nextValue);
      },
      zoom: function zoom(SVGPointX, SVGPointY, scaleFactor) {
        var nextValue = (0, _zoom2.zoom)(matrix, {
          x: SVGPointX,
          y: SVGPointY
        }, scaleFactor, scaleFactorMin, scaleFactorMax);
        updateValue(nextValue);
      },
      fitSelection: function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
        var nextValue = (0, _zoom2.fitSelection)(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight, viewerWidth, viewerHeight);
        updateValue(nextValue);
      },
      fitToViewer: function fitToViewer() {
        var SVGAlignX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.ALIGN_LEFT;
        var SVGAlignY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants.ALIGN_TOP;
        var nextValue = (0, _zoom2.fitToViewer)(viewer, SVGAttributes, SVGAlignX, SVGAlignY);
        updateValue(nextValue);
      },
      zoomOnViewerCenter: function zoomOnViewerCenter(scaleFactor) {
        var nextValue = (0, _zoom2.zoomOnViewerCenter)(matrix, viewer, scaleFactor, scaleFactorMin, scaleFactorMax);
        updateValue(nextValue);
      },
      setPointOnViewerCenter: function setPointOnViewerCenter(SVGPointX, SVGPointY, zoomLevel) {
        var nextValue = (0, _common.setPointOnViewerCenter)(viewerWidth, viewerHeight, SVGPointX, SVGPointY, zoomLevel);
        updateValue(nextValue);
      },
      reset: function reset() {
        var nextValue = (0, _common.reset)();
        updateValue(nextValue);
      },
      openMiniature: function openMiniature() {
        var nextValue = (0, _miniature.openMiniature)();
        updateValue(nextValue);
      },
      closeMiniature: function closeMiniature() {
        var nextValue = (0, _miniature.closeMiniature)();
        updateValue(nextValue);
      },
      changeTool: function changeTool(tool) {
        setTool(tool);
      }
    };
  });
  /** ReactSVGPanZoom internals **/

  function handleViewerEvent(event) {
    if (!([_constants.TOOL_NONE, _constants.TOOL_AUTO].indexOf(tool) >= 0)) return;
    if (event.target === ViewerDOM) return;
    var eventsHandler = {
      click: props.onClick,
      dblclick: props.onDoubleClick,
      mousemove: props.onMouseMove,
      mouseup: props.onMouseUp,
      mousedown: props.onMouseDown,
      touchstart: props.onTouchStart,
      touchmove: props.onTouchMove,
      touchend: props.onTouchEnd,
      touchcancel: props.onTouchCancel
    };
    var onEventHandler = eventsHandler[event.type];
    if (!onEventHandler) return;
    onEventHandler((0, _eventFactory.default)(event, matrix, boundingRect));
  }
  /** React renderer **/


  var CustomToolbar = props.customToolbar,
      CustomMiniature = props.customMiniature;
  var panningWithToolAuto = tool === _constants.TOOL_AUTO && mode === _constants.MODE_PANNING && start.x !== end.x && start.y !== end.y;
  var cursor;
  if (tool === _constants.TOOL_PAN) cursor = (0, _cursorPolyfill.default)(mode === _constants.MODE_PANNING ? 'grabbing' : 'grab');
  if (tool === _constants.TOOL_ZOOM_IN) cursor = (0, _cursorPolyfill.default)('zoom-in');
  if (tool === _constants.TOOL_ZOOM_OUT) cursor = (0, _cursorPolyfill.default)('zoom-out');
  if (panningWithToolAuto) cursor = (0, _cursorPolyfill.default)('grabbing');
  var blockChildEvents = [_constants.TOOL_PAN, _constants.TOOL_ZOOM_IN, _constants.TOOL_ZOOM_OUT].indexOf(tool) >= 0;
  blockChildEvents = blockChildEvents || panningWithToolAuto;
  var touchAction = props.detectPinchGesture || [_constants.TOOL_PAN, _constants.TOOL_AUTO].indexOf(tool) !== -1 ? 'none' : undefined;
  var style = {
    display: 'block',
    cursor: cursor,
    touchAction: touchAction
  };
  return _react.default.createElement("div", {
    style: _objectSpread({
      position: "relative",
      width: viewerWidth,
      height: viewerHeight
    }, props.style),
    className: props.className
  }, _react.default.createElement("svg", {
    ref: ViewerDOM,
    width: viewerWidth,
    height: viewerHeight,
    style: style,
    onMouseDown: function onMouseDown(event) {
      var nextValue = (0, _interactions.onMouseDown)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onMouseMove: function onMouseMove(event) {
      var nextValue = (0, _interactions.onMouseMove)(event, boundingRect, matrix, tool, props, mode, start, end, viewer, SVGAttributes);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onMouseUp: function onMouseUp(event) {
      var nextValue = (0, _interactions.onMouseUp)(event, boundingRect, matrix, tool, props, mode, start, end, viewer);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onClick: function onClick(event) {
      handleViewerEvent(event);
    },
    onDoubleClick: function onDoubleClick(event) {
      var nextValue = (0, _interactions.onDoubleClick)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onWheel: function onWheel(event) {
      var nextValue = (0, _interactions.onWheel)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
    },
    onMouseEnter: function onMouseEnter(event) {
      if ((0, _detectTouch.default)()) return;
      var nextValue = (0, _interactions.onMouseEnterOrLeave)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
    },
    onMouseLeave: function onMouseLeave(event) {
      var nextValue = (0, _interactions.onMouseEnterOrLeave)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
    },
    onTouchStart: function onTouchStart(event) {
      var nextValue = (0, _interactionsTouch.onTouchStart)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onTouchMove: function onTouchMove(event) {
      var nextValue = (0, _interactionsTouch.onTouchMove)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onTouchEnd: function onTouchEnd(event) {
      var nextValue = (0, _interactionsTouch.onTouchEnd)(event, boundingRect, matrix, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onTouchCancel: function onTouchCancel(event) {
      var nextValue = (0, _interactionsTouch.onTouchCancel)(event, boundingRect, tool, props, mode);
      if (!(0, _is.isEmpty)(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    }
  }, _react.default.createElement("rect", {
    fill: props.background,
    x: 0,
    y: 0,
    width: viewerWidth,
    height: viewerHeight,
    style: {
      pointerEvents: "none"
    }
  }), _react.default.createElement("g", {
    transform: (0, _transformationMatrix.toSVG)(matrix),
    style: blockChildEvents ? {
      pointerEvents: "none"
    } : {}
  }, _react.default.createElement("rect", {
    fill: props.SVGBackground,
    style: props.SVGStyle,
    x: SVGMinX || 0,
    y: SVGMinY || 0,
    width: SVGWidth,
    height: SVGHeight
  }), _react.default.createElement("g", null, children.props.children)), !([_constants.TOOL_NONE, _constants.TOOL_AUTO].indexOf(tool) >= 0 && props.detectAutoPan) ? null : _react.default.createElement("g", null, _react.default.createElement(_borderGradient.default, {
    direction: _constants.POSITION_TOP,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  }), _react.default.createElement(_borderGradient.default, {
    direction: _constants.POSITION_RIGHT,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  }), _react.default.createElement(_borderGradient.default, {
    direction: _constants.POSITION_BOTTOM,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  }), _react.default.createElement(_borderGradient.default, {
    direction: _constants.POSITION_LEFT,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  })), !(mode === _constants.MODE_ZOOMING) ? null : _react.default.createElement(_selection.default, {
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y
  })), props.toolbarProps.position === _constants.POSITION_NONE ? null : _react.default.createElement(CustomToolbar, _extends({}, props.toolbarProps, {
    fitToViewer: function fitToViewer(SVGAlignX, SVGAlignY) {
      return updateValue((0, _zoom2.fitToViewer)(viewer, SVGAttributes, SVGAlignX, SVGAlignY));
    },
    tool: tool,
    onChangeTool: function onChangeTool(tool) {
      setTool(tool);
      var onChangeTool = props.onChangeTool;
      if (onChangeTool) onChangeTool(tool);
    }
  })), props.miniatureProps.position === _constants.POSITION_NONE ? null : _react.default.createElement(CustomMiniature, _extends({
    viewer: viewer,
    SVGAttributes: SVGAttributes,
    miniatureOpen: miniatureOpen,
    setMiniatureOpen: setMiniatureOpen,
    matrix: matrix
  }, props.miniatureProps, {
    // value={value}
    // onChangeValue={value => updateValue(value)}
    SVGBackground: props.SVGBackground
  }), props.children.props.children));
});
ReactSVGPanZoom.propTypes = {
  /**************************************************************************/

  /*  Viewer configuration                                                  */

  /**************************************************************************/
  //width of the viewer displayed on screen
  width: _propTypes.default.number.isRequired,
  //height of the viewer displayed on screen
  height: _propTypes.default.number.isRequired,
  //handler something changed
  onChangeValue: _propTypes.default.func,
  //current active tool (TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT)
  tool: _propTypes.default.oneOf([_constants.TOOL_AUTO, _constants.TOOL_NONE, _constants.TOOL_PAN, _constants.TOOL_ZOOM_IN, _constants.TOOL_ZOOM_OUT]).isRequired,
  //handler tool changed
  onChangeTool: _propTypes.default.func,

  /**************************************************************************/

  /* Customize style                                                        */

  /**************************************************************************/
  //background of the viewer
  background: _propTypes.default.string,
  //background of the svg
  SVGBackground: _propTypes.default.string,
  //style of the svg
  SVGStyle: _propTypes.default.object,
  //CSS style of the Viewer
  style: _propTypes.default.object,
  //className of the Viewer
  className: _propTypes.default.string,

  /**************************************************************************/

  /* Detect events                                                          */

  /**************************************************************************/
  //perform zoom operation on mouse scroll
  detectWheel: _propTypes.default.bool,
  //perform PAN if the mouse is on viewer border
  detectAutoPan: _propTypes.default.bool,
  //perform zoom operation on pinch gesture
  detectPinchGesture: _propTypes.default.bool,
  //toolbar position
  toolbarPosition: _propTypes.default.oneOf([_constants.POSITION_NONE, _constants.POSITION_TOP, _constants.POSITION_RIGHT, _constants.POSITION_BOTTOM, _constants.POSITION_LEFT]),
  //handler zoom level changed
  onZoom: _propTypes.default.func,
  //handler pan action performed
  onPan: _propTypes.default.func,
  //handler click
  onClick: _propTypes.default.func,
  //handler double click
  onDoubleClick: _propTypes.default.func,
  //handler mouseup
  onMouseUp: _propTypes.default.func,
  //handler mousemove
  onMouseMove: _propTypes.default.func,
  //handler mousedown
  onMouseDown: _propTypes.default.func,

  /**************************************************************************/

  /* Some advanced configurations                                           */

  /**************************************************************************/
  //if disabled the user can move the image outside the viewer
  preventPanOutside: _propTypes.default.bool,
  //how much scale in or out
  scaleFactor: _propTypes.default.number,
  //how much scale in or out on mouse wheel (requires detectWheel enabled)
  scaleFactorOnWheel: _propTypes.default.number,
  // maximum amount of scale a user can zoom in to
  scaleFactorMax: _propTypes.default.number,
  // minimum amount of a scale a user can zoom out of
  scaleFactorMin: _propTypes.default.number,
  //modifier keys //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
  modifierKeys: _propTypes.default.array,
  //Turn off zoom on double click
  disableDoubleClickZoomWithToolAuto: _propTypes.default.bool,

  /**************************************************************************/

  /* Miniature configurations                                                 */

  /**************************************************************************/
  //override miniature component
  customMiniature: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func]),
  //miniature props
  miniatureProps: _propTypes.default.shape({
    position: _propTypes.default.oneOf([_constants.POSITION_NONE, _constants.POSITION_RIGHT, _constants.POSITION_LEFT]),
    background: _propTypes.default.string,
    width: _propTypes.default.number,
    height: _propTypes.default.number
  }),

  /**************************************************************************/

  /* Toolbar configurations                                                 */

  /**************************************************************************/
  //override toolbar component
  customToolbar: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func]),
  //toolbar props
  toolbarProps: _propTypes.default.shape({
    position: _propTypes.default.oneOf([_constants.POSITION_NONE, _constants.POSITION_TOP, _constants.POSITION_RIGHT, _constants.POSITION_BOTTOM, _constants.POSITION_LEFT]),
    SVGAlignX: _propTypes.default.oneOf([_constants.ALIGN_CENTER, _constants.ALIGN_LEFT, _constants.ALIGN_RIGHT]),
    SVGAlignY: _propTypes.default.oneOf([_constants.ALIGN_CENTER, _constants.ALIGN_TOP, _constants.ALIGN_BOTTOM])
  }),

  /**************************************************************************/

  /* Children Check                                                         */

  /**************************************************************************/
  //accept only one node SVG
  children: function children(props, propName, componentName) {
    // Only accept a single child, of the appropriate type
    //credits: http://www.mattzabriskie.com/blog/react-validating-children
    var prop = props[propName];
    var types = ['svg'];

    if (_react.default.Children.count(prop) !== 1 || types.indexOf(prop.type) === -1) {
      return new Error('`' + componentName + '` ' + 'should have a single child of the following types: ' + ' `' + types.join('`, `') + '`.');
    }

    if ((!prop.props.hasOwnProperty('width') || !prop.props.hasOwnProperty('height')) && !prop.props.hasOwnProperty('viewBox')) {
      return new Error('SVG should have props `width` and `height` or `viewBox`');
    }
  }
};
ReactSVGPanZoom.defaultProps = {
  style: {},
  background: "#616264",
  SVGBackground: "#fff",
  SVGStyle: {},
  detectWheel: true,
  detectAutoPan: true,
  detectPinchGesture: true,
  modifierKeys: ["Alt", "Shift", "Control"],
  preventPanOutside: true,
  scaleFactor: 1.1,
  scaleFactorOnWheel: 1.06,
  disableZoomWithToolAuto: false,
  onZoom: null,
  onPan: null,
  customToolbar: _toolbar.default,
  toolbarProps: {},
  customMiniature: _miniature2.default,
  miniatureProps: {}
};
var _default = ReactSVGPanZoom;
exports.default = _default;