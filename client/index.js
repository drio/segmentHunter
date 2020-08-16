import React from "react";
import ReactDOM from "react-dom";
import TestMap from "./test-map";
import "leaflet/dist/leaflet.css";

const chs = {
  lat: 32.784618,
  lon: -79.940918
};
const position = [chs.lat, chs.lon];

class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <TestMap position={position} />
        </div>
        <div>Hello {this.props.name}</div>
      </div>
    );
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<HelloMessage name="Jane" />, mountNode);
