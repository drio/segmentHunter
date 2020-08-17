import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const home = { lat: 32.782003, lng: -79.932903 };
const TOKEN =
  "pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ";

mapboxgl.accessToken = TOKEN;

function Map() {
  const mapContainer = useRef(null);

  const [state, setState] = useState({
    lng: home.lng,
    lat: home.lat,
    zoom: 13
  });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom,
      accessToken: TOKEN
    });

    map.on("move", () => {
      setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  });

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {state.lng} | Latitude: {state.lat} | Zoom: {state.zoom}
        </div>
      </div>
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
}

export default Map;
