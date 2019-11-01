import { TOOL_AUTO, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, MODE_PANNING, MODE_ZOOMING, MODE_IDLE } from '../constants';
import { setViewerCoords, getSVGPoint, getCursorPosition } from './common';
import { startPanning, updatePanning, stopPanning } from './pan';
import { startZooming, updateZooming, stopZooming, zoom } from './zoom';
import mapRange from '../utils/mapRange';
export function onMouseDown(event, boundingRect, matrix, tool, props, mode) {
  var cursurPosition = getCursorPosition(event, boundingRect);
  var nextValue = {};

  switch (tool) {
    case TOOL_ZOOM_OUT:
      var x = cursurPosition.x,
          y = cursurPosition.y;
      var SVGPoint = getSVGPoint(x, y, matrix);
      nextValue = zoom(matrix, SVGPoint, 1 / props.scaleFactor);
      break;

    case TOOL_ZOOM_IN:
      nextValue = startZooming(cursurPosition);
      break;

    case TOOL_AUTO:
    case TOOL_PAN:
      nextValue = startPanning(cursurPosition);
      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}
export function onMouseMove(event, boundingRect, matrix, tool, props, mode, start, end, viewer, SVGAttributes) {
  var cursurPosition = getCursorPosition(event, boundingRect);
  var forceExit = event.buttons === 0; //the mouse exited and reentered into svg

  var nextValue = {};

  switch (tool) {
    case TOOL_ZOOM_IN:
      if (mode === MODE_ZOOMING) nextValue = forceExit ? stopZooming(cursurPosition, start, end, matrix, props.scaleFactor, props, viewer) : updateZooming(mode, cursurPosition);
      break;

    case TOOL_AUTO:
    case TOOL_PAN:
      if (mode === MODE_PANNING) nextValue = forceExit ? stopPanning() : updatePanning(cursurPosition, start, end, matrix, props.preventPanOutside ? 20 : undefined, mode, viewer, SVGAttributes);
      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}
export function onMouseUp(event, boundingRect, matrix, tool, props, mode, start, end, viewer) {
  var cursurPosition = getCursorPosition(event, boundingRect);
  var nextValue = {};

  switch (tool) {
    case TOOL_ZOOM_OUT:
      if (mode === MODE_ZOOMING) nextValue = stopZooming(cursurPosition, start, end, matrix, 1 / props.scaleFactor, props, viewer);
      break;

    case TOOL_ZOOM_IN:
      if (mode === MODE_ZOOMING) nextValue = stopZooming(cursurPosition, start, end, matrix, props.scaleFactor, props, viewer);
      break;

    case TOOL_AUTO:
    case TOOL_PAN:
      if (mode === MODE_PANNING) nextValue = stopPanning();
      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}
export function onDoubleClick(event, boundingRect, matrix, tool, props, mode) {
  var cursurPosition = getCursorPosition(event, boundingRect);
  var x = cursurPosition.x,
      y = cursurPosition.y;
  var nextValue = {};

  switch (tool) {
    case TOOL_AUTO:
      if (!props.disableDoubleClickZoomWithToolAuto) {
        var SVGPoint = getSVGPoint(x, y);

        var modifierKeysReducer = function modifierKeysReducer(current, modifierKey) {
          return current || event.getModifierState(modifierKey);
        };

        var modifierKeyActive = props.modifierKeys.reduce(modifierKeysReducer, false);
        var scaleFactor = modifierKeyActive ? 1 / props.scaleFactor : props.scaleFactor;
        nextValue = zoom(SVGPoint.x, SVGPoint.y, scaleFactor, props);
      }

      break;

    default:
      return {};
  }

  event.preventDefault();
  return nextValue;
}
export function onWheel(event, boundingRect, matrix, tool, props, mode) {
  var cursurPosition = getCursorPosition(event, boundingRect);
  var x = cursurPosition.x,
      y = cursurPosition.y;
  if (!props.detectWheel) return {};
  var delta = Math.max(-1, Math.min(1, event.deltaY));
  var scaleFactor = mapRange(delta, -1, 1, props.scaleFactorOnWheel, 1 / props.scaleFactorOnWheel);
  var SVGPoint = getSVGPoint(x, y, matrix);
  event.preventDefault();
  return zoom(matrix, SVGPoint, scaleFactor);
}
export function onMouseEnterOrLeave(event, boundingRect, matrix, tool, props, mode) {
  event.preventDefault();
  return {
    focus: event.type === 'mouseenter'
  };
}