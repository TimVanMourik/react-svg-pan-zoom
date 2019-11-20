import {identity} from 'transformation-matrix';

import {
  POSITION_NONE,
  TOOL_AUTO,
  NULL_POSITION,
  MODE_IDLE
} from '../constants';


export const INITIAL_STATE = {
  settings: {
    preventPanOutside: null,
    detectPinchGesture: false,
    detectWheel: true,
    modifierKeys: [],
    pinchPointDistance: null,
    prePinchMode: null,
  },
  autoPanning: {
    autoPanIsRunning: true,
    autoPanHover: POSITION_NONE,
  },
  scaleFactors: {
    scaleFactor: 1.1,
    scaleFactorMin: 0.01,
    scaleFactorMax: 100,
    scaleFactorOnWheel: 1.1,
  },
  controls: {
    tool: TOOL_AUTO,
    miniatureOpen: true,
  },
  viewer: {
    matrix: identity(),
    start: NULL_POSITION,
    end: NULL_POSITION,
    mode: MODE_IDLE,
    focus: false,
    lastAction: null
  },
  geometry: {
    boundingRect: {x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0},
    viewerSize: {viewerWidth: 0, viewerHeight: 0},
    SVGGeometry: {SVGMinX: 0, SVGMinY: 0, SVGWidth: 0, SVGHeight: 0},
  }
}