import { useState, useEffect } from "react";
import Slider from "rc-slider";
import moment from "moment";

const style = {
  fontSize: 14,
  width: 400,
  margin: 50,
  background: "rgba(68, 65, 65, 0.84)",
  margin: "2px",
  padding: "12px",
  borderRadius: "4px",
  color: "white",
  display: "inline-block",
  position: "absolute",
  top: 0,
  left: 0,
  margin: "12px",
  zIndex: "1 !important"
};

const DATE_FORMAT = "dddd, MMMM Do YYYY, h:mm:ss a";

const formatDate = s => moment(s).format(DATE_FORMAT);

function WeatherSlider({ data, changeAction }) {
  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);

  useEffect(() => {
    setMax(data.length);
    setTimeString(formatDate(data[0].startTime));
  }, []);

  return (
    <div style={style}>
      <div> {timeString} </div>
      <div>
        {data[value].temperature}F ({data[value].windDirection}){" "}
        {data[value].windSpeed}
      </div>
      <div>{data[value].shortForecast} </div>
      <Slider
        value={value}
        min={0}
        max={max}
        step={1}
        onChange={v => {
          setValue(v);
          setTimeString(formatDate(data[v].startTime));
          changeAction(data[v]);
        }}
      />
    </div>
  );
}

export default WeatherSlider;
