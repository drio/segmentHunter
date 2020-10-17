import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Segment, WeatherEntry } from "../logic/types";
import {
  formatDate,
  toFahrenheit,
  toMilesHour,
  degToCompass,
  handleLogout,
} from "../logic/utils";

const MAX_SEGMENT_TEXT_SIZE = 35;

const ControlsDiv = styled.div`
  font-size: 16px;
  width: 370px;
  margin: 0;
  background: rgba(68, 65, 65, 0.9);
  padding: 14px;
  border-radius: 10px;
  color: white;
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 4px;
  z-index: 2;
`;

interface LoggedInProps {
  profile: string | "";
}

function LoggedIn(props: LoggedInProps) {
  const { profile } = props;

  return (
    <div
      className="buttons are-small"
      style={{
        justifyContent: "flex-end",
        padding: "0px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          alignSelf: "flex-start",
          flex: "2 0 0",
        }}
      >
        Made with ❤️ by{" "}
        <a href="https://drio.org">
          <span style={{ color: "tomato", fontWeight: "bold" }}>drio</span>
        </a>
        .
      </div>

      <figure className="image is-32x32" style={{ marginRight: "10px" }}>
        <img className="is-rounded" src={profile} />
      </figure>

      <button
        onClick={handleLogout}
        className="button is-danger"
        style={{ marginBottom: 0 }}
      >
        logout
      </button>
    </div>
  );
}

interface ControlProps {
  segments: Segment[];
  weather: WeatherEntry[];
  profile: string | "";
  actionNewWindDirection: (n: number) => void;
  actionSegmentClick: (d: number) => void;
}

// https://en.wikipedia.org/wiki/Cardinal_direction#/media/File:Brosen_windrose.svg
function Controls(props: ControlProps): JSX.Element | null {
  const {
    segments,
    weather,
    profile,
    actionNewWindDirection,
    actionSegmentClick,
  } = props;

  const [value, setValue] = useState(0);
  const [showSegmentDetails, setShowSegmentDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const noWeatherData = weather.length < 1;

  useEffect(() => setShowSegmentDetails(false), []);

  function handleSegmentClick(selSegment: Segment) {
    const { id } = selSegment;
    const somethingSelected = id === selectedId ? false : true;
    actionSegmentClick(somethingSelected ? id : -1);
    setSelectedId(somethingSelected ? id : null);
  }

  if (noWeatherData) return null;

  const { temp, wind_deg, wind_speed, dt } = weather[value];
  const description = weather[value].weather.description;
  const timeString = dt ? formatDate(dt) : "-";
  const max = weather.length > 0 ? weather.length - 1 : 0;

  return (
    <ControlsDiv>
      <LoggedIn profile={profile} />

      {weather.length > 0 && (
        <>
          <div className="box" style={{ padding: 12 }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                paddingBottom: "5px",
              }}
            >
              <b>Time Selection</b>
            </div>
            <div style={{ paddingBottom: "0px" }}>
              <b>Time</b>: <label id="timeString">{timeString}</label>
            </div>

            <div>
              <b>Temperature</b>: {temp.toFixed(0)}C | {toFahrenheit(temp)}F{" "}
            </div>

            <div>
              <b>Wind direction</b>: {degToCompass(wind_deg)} / {wind_deg}°
            </div>

            <div>
              <b>Wind speed</b>: {toMilesHour(wind_speed)} miles/h |{" "}
              {wind_speed} m/s
            </div>

            <div>{description} </div>
            <input
              id="weatherSlider"
              style={{ width: "100%" }}
              step="1"
              min="0"
              max={max}
              value={value}
              onChange={(e) => {
                const v = +e.target.value;
                const { wind_deg } = weather[v];
                setValue(v);
                actionNewWindDirection(wind_deg);
              }}
              type="range"
            />
          </div>
        </>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <span style={{ verticalAlign: "top" }}>
            ⭐️ {segments.length} segments loaded{" "}
          </span>
          <button
            onClick={() => setShowSegmentDetails(!showSegmentDetails)}
            className="button is-small is-warning is-rounded"
            id="hideShowButton"
          >
            {segments.length > 0 && showSegmentDetails ? "hide" : "show"}
          </button>
        </div>

        {showSegmentDetails && (
          <div
            className="container"
            id="containerListSegments"
            style={{
              margin: 0,
              textOverflow: "Ellipsis",
              maxHeight: "55vh",
              overflow: "scroll",
            }}
          >
            <div>
              {segments.map((s) => (
                <div key={s.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      onClick={() => handleSegmentClick(s)}
                      id={`input-${s.id}`}
                      checked={s.id === selectedId}
                      readOnly
                    />{" "}
                    {s.name.length > MAX_SEGMENT_TEXT_SIZE
                      ? s.name.slice(0, MAX_SEGMENT_TEXT_SIZE) + " ..."
                      : s.name}{" "}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ControlsDiv>
  );
}

export default Controls;
