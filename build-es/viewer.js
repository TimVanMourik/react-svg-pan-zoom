function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { identity, toSVG } from 'transformation-matrix'; //events

import eventFactory from './events/event-factory'; //features

import { pan as _pan } from './features/pan';
import { reset as _reset, setPointOnViewerCenter as _setPointOnViewerCenter } from './features/common';
import { onDoubleClick as _onDoubleClick, onMouseDown as _onMouseDown, onMouseEnterOrLeave, onMouseMove as _onMouseMove, onMouseUp as _onMouseUp, onWheel as _onWheel } from './features/interactions';
import parseViewBox from './utils/ViewBoxParser';
import { isEmpty } from "./utils/is";
import { onTouchCancel as _onTouchCancel, onTouchEnd as _onTouchEnd, onTouchMove as _onTouchMove, onTouchStart as _onTouchStart } from './features/interactions-touch';
import { fitSelection as _fitSelection, fitToViewer as _fitToViewer, zoom as _zoom, zoomOnViewerCenter as _zoomOnViewerCenter } from './features/zoom';
import { closeMiniature as _closeMiniature, openMiniature as _openMiniature } from './features/miniature'; //ui

import cursorPolyfill from './ui/cursor-polyfill';
import BorderGradient from './ui/border-gradient';
import Selection from './ui/selection';
import Toolbar from './ui-toolbar/toolbar';
import detectTouch from './ui/detect-touch';
import Miniature from './ui-miniature/miniature';
import { ACTION_PAN, ACTION_ZOOM, ALIGN_BOTTOM, ALIGN_CENTER, ALIGN_LEFT, ALIGN_RIGHT, ALIGN_TOP, MODE_IDLE, MODE_PANNING, MODE_ZOOMING, POSITION_BOTTOM, POSITION_LEFT, POSITION_NONE, POSITION_RIGHT, POSITION_TOP, TOOL_AUTO, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, NULL_POSITION } from './constants';
import { printMigrationTipsRelatedToProps } from "./migration-tips";
var ReactSVGPanZoom = forwardRef(function (props, Viewer) {
  if (process.env.NODE_ENV !== 'production') {
    printMigrationTipsRelatedToProps(props);
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

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      autoPanIsRunning = _useState2[0],
      setAutoPanning = _useState2[1];

  var _useState3 = useState(POSITION_NONE),
      _useState4 = _slicedToArray(_useState3, 2),
      autoPanHover = _useState4[0],
      setAutoPanHover = _useState4[1];

  var _useState5 = useState(TOOL_AUTO),
      _useState6 = _slicedToArray(_useState5, 2),
      tool = _useState6[0],
      setTool = _useState6[1];

  var _useState7 = useState(identity()),
      _useState8 = _slicedToArray(_useState7, 2),
      matrix = _useState8[0],
      setMatrix = _useState8[1];

  var _useState9 = useState(NULL_POSITION),
      _useState10 = _slicedToArray(_useState9, 2),
      start = _useState10[0],
      setStart = _useState10[1];

  var _useState11 = useState(NULL_POSITION),
      _useState12 = _slicedToArray(_useState11, 2),
      end = _useState12[0],
      setEnd = _useState12[1];

  var _useState13 = useState(MODE_IDLE),
      _useState14 = _slicedToArray(_useState13, 2),
      mode = _useState14[0],
      setMode = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      focus = _useState16[0],
      setFocus = _useState16[1];

  var _useState17 = useState(null),
      _useState18 = _slicedToArray(_useState17, 2),
      pinchPointDistance = _useState18[0],
      setPinchPointDistance = _useState18[1];

  var _useState19 = useState(null),
      _useState20 = _slicedToArray(_useState19, 2),
      prePinchMode = _useState20[0],
      setPrePinchMode = _useState20[1];

  var _useState21 = useState(true),
      _useState22 = _slicedToArray(_useState21, 2),
      miniatureOpen = _useState22[0],
      setMiniatureOpen = _useState22[1];

  var _useState23 = useState(null),
      _useState24 = _slicedToArray(_useState23, 2),
      lastAction = _useState24[0],
      setLastAction = _useState24[1];

  var ViewerDOM = useRef(null);
  var boundingRect = ViewerDOM.current && ViewerDOM.current.getBoundingClientRect();
  var SVGViewBox = children.props.viewBox;

  var _ref = SVGViewBox ? parseViewBox(SVGViewBox) : {
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
  var hoverBorderRef = useRef();
  useEffect(function () {
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

    if (autoPanHover === POSITION_NONE) {
      cancelAnimationFrame(hoverBorderRef.current);
    } else {
      switch (autoPanHover) {
        case POSITION_TOP:
          deltaY = -2;
          break;

        case POSITION_RIGHT:
          deltaX = 2;
          break;

        case POSITION_BOTTOM:
          deltaY = 2;
          break;

        case POSITION_LEFT:
          deltaX = -2;
          break;
      }

      var delta = {
        x: deltaX / inputMatrix.d,
        y: deltaY / inputMatrix.d
      };

      var nextValue = _pan(inputMatrix, delta, viewer, SVGAttributes, props.preventPanOutside ? 20 : undefined);

      updateValue(nextValue);
      hoverBorderRef.current = requestAnimationFrame(function () {
        return panOnHover(nextValue.matrix);
      });
    }
  }; // on value change


  useEffect(function () {
    var onChangeValue = props.onChangeValue,
        onZoom = props.onZoom,
        onPan = props.onPan;
    var nextValue = getValue();
    if (onChangeValue) onChangeValue(nextValue);

    if (nextValue.lastAction) {
      if (onZoom && nextValue.lastAction === ACTION_ZOOM) onZoom(nextValue);
      if (onPan && nextValue.lastAction === ACTION_PAN) onPan(nextValue);
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


  useImperativeHandle(Viewer, function () {
    return {
      pan: function pan(SVGDeltaX, SVGDeltaY) {
        var nextValue = _pan(matrix, {
          x: SVGDeltaX,
          y: SVGDeltaY
        }, viewer, SVGAttributes, props.preventPanOutside ? 20 : undefined);

        updateValue(nextValue);
      },
      zoom: function zoom(SVGPointX, SVGPointY, scaleFactor) {
        var nextValue = _zoom(matrix, {
          x: SVGPointX,
          y: SVGPointY
        }, scaleFactor, scaleFactorMin, scaleFactorMax);

        updateValue(nextValue);
      },
      fitSelection: function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
        var nextValue = _fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight, viewerWidth, viewerHeight);

        updateValue(nextValue);
      },
      fitToViewer: function fitToViewer() {
        var SVGAlignX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ALIGN_LEFT;
        var SVGAlignY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ALIGN_TOP;

        var nextValue = _fitToViewer(viewer, SVGAttributes, SVGAlignX, SVGAlignY);

        updateValue(nextValue);
      },
      zoomOnViewerCenter: function zoomOnViewerCenter(scaleFactor) {
        var nextValue = _zoomOnViewerCenter(matrix, viewer, scaleFactor, scaleFactorMin, scaleFactorMax);

        updateValue(nextValue);
      },
      setPointOnViewerCenter: function setPointOnViewerCenter(SVGPointX, SVGPointY, zoomLevel) {
        var nextValue = _setPointOnViewerCenter(viewerWidth, viewerHeight, SVGPointX, SVGPointY, zoomLevel);

        updateValue(nextValue);
      },
      reset: function reset() {
        var nextValue = _reset();

        updateValue(nextValue);
      },
      openMiniature: function openMiniature() {
        var nextValue = _openMiniature();

        updateValue(nextValue);
      },
      closeMiniature: function closeMiniature() {
        var nextValue = _closeMiniature();

        updateValue(nextValue);
      },
      changeTool: function changeTool(tool) {
        setTool(tool);
      }
    };
  });
  /** ReactSVGPanZoom internals **/

  function handleViewerEvent(event) {
    if (!([TOOL_NONE, TOOL_AUTO].indexOf(tool) >= 0)) return;
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
    onEventHandler(eventFactory(event, matrix, boundingRect));
  }
  /** React renderer **/


  var CustomToolbar = props.customToolbar,
      CustomMiniature = props.customMiniature;
  var panningWithToolAuto = tool === TOOL_AUTO && mode === MODE_PANNING && start.x !== end.x && start.y !== end.y;
  var cursor;
  if (tool === TOOL_PAN) cursor = cursorPolyfill(mode === MODE_PANNING ? 'grabbing' : 'grab');
  if (tool === TOOL_ZOOM_IN) cursor = cursorPolyfill('zoom-in');
  if (tool === TOOL_ZOOM_OUT) cursor = cursorPolyfill('zoom-out');
  if (panningWithToolAuto) cursor = cursorPolyfill('grabbing');
  var blockChildEvents = [TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT].indexOf(tool) >= 0;
  blockChildEvents = blockChildEvents || panningWithToolAuto;
  var touchAction = props.detectPinchGesture || [TOOL_PAN, TOOL_AUTO].indexOf(tool) !== -1 ? 'none' : undefined;
  var style = {
    display: 'block',
    cursor: cursor,
    touchAction: touchAction
  };
  return React.createElement("div", {
    style: _objectSpread({
      position: "relative",
      width: viewerWidth,
      height: viewerHeight
    }, props.style),
    className: props.className
  }, React.createElement("svg", {
    ref: ViewerDOM,
    width: viewerWidth,
    height: viewerHeight,
    style: style,
    onMouseDown: function onMouseDown(event) {
      var nextValue = _onMouseDown(event, boundingRect, matrix, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onMouseMove: function onMouseMove(event) {
      var nextValue = _onMouseMove(event, boundingRect, matrix, tool, props, mode, start, end, viewer, SVGAttributes);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onMouseUp: function onMouseUp(event) {
      var nextValue = _onMouseUp(event, boundingRect, matrix, tool, props, mode, start, end, viewer);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onClick: function onClick(event) {
      handleViewerEvent(event);
    },
    onDoubleClick: function onDoubleClick(event) {
      var nextValue = _onDoubleClick(event, boundingRect, matrix, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onWheel: function onWheel(event) {
      var nextValue = _onWheel(event, boundingRect, matrix, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
    },
    onMouseEnter: function onMouseEnter(event) {
      if (detectTouch()) return;
      var nextValue = onMouseEnterOrLeave(event, boundingRect, matrix, tool, props, mode);
      if (!isEmpty(nextValue)) updateValue(nextValue);
    },
    onMouseLeave: function onMouseLeave(event) {
      var nextValue = onMouseEnterOrLeave(event, boundingRect, matrix, tool, props, mode);
      if (!isEmpty(nextValue)) updateValue(nextValue);
    },
    onTouchStart: function onTouchStart(event) {
      var nextValue = _onTouchStart(event, boundingRect, matrix, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onTouchMove: function onTouchMove(event) {
      var nextValue = _onTouchMove(event, boundingRect, matrix, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onTouchEnd: function onTouchEnd(event) {
      var nextValue = _onTouchEnd(event, boundingRect, matrix, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    },
    onTouchCancel: function onTouchCancel(event) {
      var nextValue = _onTouchCancel(event, boundingRect, tool, props, mode);

      if (!isEmpty(nextValue)) updateValue(nextValue);
      handleViewerEvent(event);
    }
  }, React.createElement("rect", {
    fill: props.background,
    x: 0,
    y: 0,
    width: viewerWidth,
    height: viewerHeight,
    style: {
      pointerEvents: "none"
    }
  }), React.createElement("g", {
    transform: toSVG(matrix),
    style: blockChildEvents ? {
      pointerEvents: "none"
    } : {}
  }, React.createElement("rect", {
    fill: props.SVGBackground,
    style: props.SVGStyle,
    x: SVGMinX || 0,
    y: SVGMinY || 0,
    width: SVGWidth,
    height: SVGHeight
  }), React.createElement("g", null, children.props.children)), !([TOOL_NONE, TOOL_AUTO].indexOf(tool) >= 0 && props.detectAutoPan) ? null : React.createElement("g", null, React.createElement(BorderGradient, {
    direction: POSITION_TOP,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  }), React.createElement(BorderGradient, {
    direction: POSITION_RIGHT,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  }), React.createElement(BorderGradient, {
    direction: POSITION_BOTTOM,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  }), React.createElement(BorderGradient, {
    direction: POSITION_LEFT,
    width: viewerWidth,
    height: viewerHeight,
    setAutoPanHover: setAutoPanHover
  })), !(mode === MODE_ZOOMING) ? null : React.createElement(Selection, {
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y
  })), props.toolbarProps.position === POSITION_NONE ? null : React.createElement(CustomToolbar, _extends({}, props.toolbarProps, {
    fitToViewer: function fitToViewer(SVGAlignX, SVGAlignY) {
      return updateValue(_fitToViewer(viewer, SVGAttributes, SVGAlignX, SVGAlignY));
    },
    tool: tool,
    onChangeTool: function onChangeTool(tool) {
      setTool(tool);
      var onChangeTool = props.onChangeTool;
      if (onChangeTool) onChangeTool(tool);
    }
  })), props.miniatureProps.position === POSITION_NONE ? null : React.createElement(CustomMiniature, _extends({
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
  width: PropTypes.number.isRequired,
  //height of the viewer displayed on screen
  height: PropTypes.number.isRequired,
  //handler something changed
  onChangeValue: PropTypes.func,
  //current active tool (TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT)
  tool: PropTypes.oneOf([TOOL_AUTO, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT]).isRequired,
  //handler tool changed
  onChangeTool: PropTypes.func,

  /**************************************************************************/

  /* Customize style                                                        */

  /**************************************************************************/
  //background of the viewer
  background: PropTypes.string,
  //background of the svg
  SVGBackground: PropTypes.string,
  //style of the svg
  SVGStyle: PropTypes.object,
  //CSS style of the Viewer
  style: PropTypes.object,
  //className of the Viewer
  className: PropTypes.string,

  /**************************************************************************/

  /* Detect events                                                          */

  /**************************************************************************/
  //perform zoom operation on mouse scroll
  detectWheel: PropTypes.bool,
  //perform PAN if the mouse is on viewer border
  detectAutoPan: PropTypes.bool,
  //perform zoom operation on pinch gesture
  detectPinchGesture: PropTypes.bool,
  //toolbar position
  toolbarPosition: PropTypes.oneOf([POSITION_NONE, POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT]),
  //handler zoom level changed
  onZoom: PropTypes.func,
  //handler pan action performed
  onPan: PropTypes.func,
  //handler click
  onClick: PropTypes.func,
  //handler double click
  onDoubleClick: PropTypes.func,
  //handler mouseup
  onMouseUp: PropTypes.func,
  //handler mousemove
  onMouseMove: PropTypes.func,
  //handler mousedown
  onMouseDown: PropTypes.func,

  /**************************************************************************/

  /* Some advanced configurations                                           */

  /**************************************************************************/
  //if disabled the user can move the image outside the viewer
  preventPanOutside: PropTypes.bool,
  //how much scale in or out
  scaleFactor: PropTypes.number,
  //how much scale in or out on mouse wheel (requires detectWheel enabled)
  scaleFactorOnWheel: PropTypes.number,
  // maximum amount of scale a user can zoom in to
  scaleFactorMax: PropTypes.number,
  // minimum amount of a scale a user can zoom out of
  scaleFactorMin: PropTypes.number,
  //modifier keys //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
  modifierKeys: PropTypes.array,
  //Turn off zoom on double click
  disableDoubleClickZoomWithToolAuto: PropTypes.bool,

  /**************************************************************************/

  /* Miniature configurations                                                 */

  /**************************************************************************/
  //override miniature component
  customMiniature: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  //miniature props
  miniatureProps: PropTypes.shape({
    position: PropTypes.oneOf([POSITION_NONE, POSITION_RIGHT, POSITION_LEFT]),
    background: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
  }),

  /**************************************************************************/

  /* Toolbar configurations                                                 */

  /**************************************************************************/
  //override toolbar component
  customToolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  //toolbar props
  toolbarProps: PropTypes.shape({
    position: PropTypes.oneOf([POSITION_NONE, POSITION_TOP, POSITION_RIGHT, POSITION_BOTTOM, POSITION_LEFT]),
    SVGAlignX: PropTypes.oneOf([ALIGN_CENTER, ALIGN_LEFT, ALIGN_RIGHT]),
    SVGAlignY: PropTypes.oneOf([ALIGN_CENTER, ALIGN_TOP, ALIGN_BOTTOM])
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

    if (React.Children.count(prop) !== 1 || types.indexOf(prop.type) === -1) {
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
  customToolbar: Toolbar,
  toolbarProps: {},
  customMiniature: Miniature,
  miniatureProps: {}
};
export default ReactSVGPanZoom;