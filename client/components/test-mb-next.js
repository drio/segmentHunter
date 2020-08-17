import { Component } from "react";
import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

const home = [32.782003, -79.932903];

function Map() {
  const [state, setState] = useState({
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: home[0],
      longitude: home[1],
      zoom: 13
    }
  });

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken="pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ"
      onViewportChange={viewport => setState({ viewport })}
      {...state.viewport}
    />
  );
}

export default Map;
