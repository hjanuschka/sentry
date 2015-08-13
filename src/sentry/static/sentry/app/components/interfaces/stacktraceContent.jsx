import React from "react";
//import GroupEventDataSection from "../eventDataSection";
import ConfigStore from "../../stores/configStore";
import Frame from "./frame";
import {defined} from "../../utils";

var StacktraceContent = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    includeSystemFrames: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      includeSystemFrames: true
    };
  },

  render() {
    var user = ConfigStore.get("user");
    var data = this.props.data;
    var firstFrameOmitted, lastFrameOmitted;
    var includeSystemFrames = this.props.includeSystemFrames;

    if (data.framesOmitted) {
      firstFrameOmitted = data.framesOmitted[0];
      lastFrameOmitted = data.framesOmitted[1];
    } else {
      firstFrameOmitted = null;
      lastFrameOmitted = null;
    }

    var frames = [];
    data.frames.forEach((frame, frameIdx) => {
      if (includeSystemFrames || frame.inApp) {
        frames.push(<Frame key={frameIdx} data={frame} />);
      }
      if (frameIdx === firstFrameOmitted) {
        frames.push((
          <li className="frames-omitted" key="omitted">
            Frames {firstFrameOmitted} until {lastFrameOmitted} were omitted and not available.
          </li>
        ));
      }
    });

    // TODO(dcramer): Python needs to default to newest first
    if (user.options.stacktraceOrder == "newestFirst") {
      frames.reverse();
    }

    return (
      <div className="traceback">
        <ul>
          {frames}
        </ul>
      </div>
    );
  }
});

export default StacktraceContent;

