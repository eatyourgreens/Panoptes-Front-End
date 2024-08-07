module.exports =
  anchoredEllipse: require('./anchored-ellipse').default
  bezier: require './poly-curve'
  circle: require './circle'
  column: require './column-rectangle'
  ellipse: require './ellipse'
  fan: require('./components/Fan').default
  freehandLine: require './freehand-line'
  freehandSegmentLine: require './freehand-segment-line'
  freehandSegmentShape: require('./freehand-segment-shape').default
  freehandShape: require('./freehand-shape').default
  fullWidthLine: require './full-width-line'
  fullHeightLine: require './full-height-line'
  grid: require './grid'
  line: require './line'
  point: require './point'
  polygon: require './polygon'
  rectangle: require './rectangle'
  rotateRectangle: require('./rotate-rectangle').default
  triangle: require './triangle'
  pointGrid: require('./point-grid').default
  transcriptionLine: require './line'

#  Temporal tools only work in FEM's classifier.
#  We're importing 'placeholders' here only to allow these tools to be edited in PFE Lab.
  temporalPoint: require './point'
  temporalRotateRectangle: require('./rotate-rectangle').default
