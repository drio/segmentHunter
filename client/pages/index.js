import { useState } from "react";
import dynamic from "next/dynamic";
import segments from "../data/segments/all.json";
import weather from "../data/weather/hourly.json";
import WeatherSlider from "../components/weather_slider";

const importMap = () => import("../components/map");

const Map = dynamic(importMap, {
  ssr: false
});

const sc_segments_only = segments.filter(s => s.state == "SC");

const App = () => {
  const [windDirection, setWindDirection] = useState("N");

  return (
    <div>
      <WeatherSlider
        data={weather}
        changeAction={e => {
          if (e) setWindDirection(e.windDirection);
        }}
      />
      <Map
        segments={sc_segments_only}
        weather={weather}
        windDirection={windDirection}
      />
    </div>
  );
};

export default App;
