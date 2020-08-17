import { Component } from "react";
import ReactMapGL from "react-map-gl";

const home = [32.782003, -79.932903];

class Map extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: home[0],
      longitude: home[1],
      zoom: 13
    }
  };

  render() {
    return (
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ"
        onViewportChange={viewport => this.setState({ viewport })}
        {...this.state.viewport}
      />
    );
  }
}

export default Map;
