import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import getSubjectLocation from '../lib/getSubjectLocation';
import getSubjectLocations from '../lib/getSubjectLocations';
import PanZoom from './pan-zoom';
import FileViewer from './file-viewer';


export default class FrameViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameDimensions: {
        height: 0,
        width: 0
      },
      loading: true
    };
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad(e) {
    const width = e.target.videoWidth || e.target.naturalWidth || 100;
    const height = e.target.videoHeight || e.target.naturalHeight || 100;

    this.setState({
      loading: false,
      frameDimensions: {
        height: height || 0,
        width: width || 0
      },
      viewBoxDimensions: {
        height: height || 0,
        width: width || 0,
        x: 0,
        y: 0
      }
    });

    if (this.props.onLoad) { this.props.onLoad(e, this.props.frame); }
  }

  render() {
    const FrameWrapper = this.props.frameWrapper;
    let type;
    let format;
    let src;

    if (this.props.isAudioPlusImage) {
      const subjectLocations = getSubjectLocations(this.props.subject);
      type = Object.keys(subjectLocations);
      format = Object.keys(subjectLocations).map(locationKey =>
         subjectLocations[locationKey][0]
      );
      src = Object.keys(subjectLocations).map(locationKey =>
         subjectLocations[locationKey][1]
      );
    } else {
      ({ type, format, src } = getSubjectLocation(this.props.subject, this.props.frame));
    }
    if (this.props.isVolumetric) {
      type = 'volumetric';
    }

    const zoomEnabled = (
      this.props.workflow &&
      this.props.workflow.configuration.pan_and_zoom &&
      (type === 'image' || type === 'application' || this.props.isAudioPlusImage)
    );
    const modellingProps = type === 'application' ? { // could be a more specific type check here
      annotation: this.props.annotation,
      annotations: this.props.annotations,
      subject: this.props.subject,
      workflow: this.props.workflow
    } : {};

    if (FrameWrapper) {
      return (
        <PanZoom
          ref={(c) => { this.panZoom = c; }}
          enabled={this.props.zoomControls && zoomEnabled}
          experimental_tools={this.props.project?.experimental_tools}
          frameDimensions={this.state.frameDimensions}
          subject={this.props.subject}
        >
          <FrameWrapper
            frame={this.props.frame}
            naturalWidth={this.state.frameDimensions.width || 0}
            naturalHeight={this.state.frameDimensions.height || 0}
            workflow={this.props.workflow}
            subject={this.props.subject}
            annotation={this.props.annotation}
            annotations={this.props.annotations}
            project={this.props.project}
            loading={this.state.loading}
            preferences={this.props.preferences}
            modification={this.props.modification || {}}
            onChange={this.props.onChange}
          >
            <FileViewer
              src={src}
              type={type}
              format={format}
              frame={this.props.frame}
              onLoad={this.handleLoad}
              onFocus={(this.panZoom && zoomEnabled) ? this.panZoom.togglePanOn : () => {}}
              onBlur={(this.panZoom && zoomEnabled) ? this.panZoom.togglePanOff : () => {}}
              {...modellingProps}
            />
          </FrameWrapper>
        </PanZoom>
      );
    } else if (this.props.isGroupSubject) {
      return (
        <Link
          className="linked-image"
          title={`Subject ${this.props.groupSubjectId}`}
          to={this.props.groupSubjectLink}
        >
          <FileViewer
            src={src}
            type={type}
            format={format}
            frame={this.props.frame}
            onLoad={this.handleLoad}
            progressListener={this.props.progressListener}
            registerProgressObject={this.props.registerProgressObject}
            {...modellingProps}
          />
        </Link>
      )
    } else {
      return (
        <FileViewer
          src={src}
          type={type}
          format={format}
          frame={this.props.frame}
          onLoad={this.handleLoad}
          progressListener={this.props.progressListener}
          registerProgressObject={this.props.registerProgressObject}
          {...modellingProps}
        />
      );
    }
  }
}

FrameViewer.propTypes = {
  annotation: PropTypes.shape(
    { id: PropTypes.string }
  ),
  annotations: PropTypes.arrayOf(PropTypes.object),
  frame: PropTypes.number,
  frameWrapper: PropTypes.func,
  groupSubjectId: PropTypes.string,
  groupSubjectLink: PropTypes.string,
  isGroupSubject: PropTypes.bool,
  isVolumetric: PropTypes.bool,
  modification: PropTypes.object,
  onChange: PropTypes.func,
  onLoad: PropTypes.func,
  preferences: PropTypes.shape(
    { id: PropTypes.string }
  ),
  subject: PropTypes.shape(
    { id: PropTypes.string }
  ),
  workflow: PropTypes.shape(
    { configuration: PropTypes.object }
  ),
  zoomControls: PropTypes.bool
};

FrameViewer.defaultProps = {
  annotations: [],
  frame: 0,
  groupSubjectId: undefined,
  groupSubjectLink: undefined,  // If a Subject is a "Subject Group", each frame can link to its constituent Subject's Talk page.
  isGroupSubject: false,  // A "Subject Group" is a type of Subject that's composed of many (single image) Subjects
  isVolumetric: false, // volumetric projects need to use the imported viewer
  onChange: () => {},
  preferences: { },
  subject: {
    locations: []
  },
  workflow: {
    configuration: {}
  },
  zoomControls: true
};
