import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const home = { lat: 32.782003, lng: -79.932903 };
const TOKEN =
  "pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ";

mapboxgl.accessToken = TOKEN;

class MapClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: home.lng,
      lat: home.lat,
      zoom: 13
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    new mapboxgl.Marker().setLngLat([home.lng, home.lat]).addTo(map);

    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    return (
      <div>
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{" "}
            {this.state.zoom}
          </div>
        </div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

function Map() {
  const mapContainer = useRef(null);

  const [state, setState] = useState({
    lng: home.lng,
    lat: home.lat,
    zoom: 13
  });

  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom,
      accessToken: TOKEN
    });

    if (!marker) {
      setMarker(
        new mapboxgl.Marker().setLngLat([home.lng, home.lat]).addTo(map)
      );
    }

    map.on("move", () => {
      setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }, []);

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
