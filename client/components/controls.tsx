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

const MainRowLoginInfo = styled.div`
  display: "flex";
  justify-content: "flex-end";
  align-items: "center";
  margin: 5;
`;

interface LoggedInProps {
  profile: string | "";
}

function LoggedIn(props: LoggedInProps) {
  const { profile } = props;

  return (
    <MainRowLoginInfo className="container buttons are-small">
      <div style={{ paddingRight: "10px" }}>
        <figure className="image is-32x32">
          <img className="is-rounded" src={profile} />
        </figure>
      </div>

      <div>
        <button onClick={handleLogout} className="button is-danger">
          logout
        </button>
      </div>
    </MainRowLoginInfo>
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
function Controls(props: ControlProps): JSX.Element {
  const {
    segments,
    weather,
    profile,
    actionNewWindDirection,
    actionSegmentClick,
  } = props;

  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);
  const [showSegmentDetails, setShowSegmentDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setMax(weather.length - 1);
    setTimeString(formatDate(weather[0].dt));
    setShowSegmentDetails(false);
  }, []);

  const { temp, wind_deg, wind_speed, dt } = weather[value];
  const description = weather[value].weather.description;

  function handleSegmentClick(selSegment: Segment) {
    const { id } = selSegment;
    const somethingSelected = id === selectedId ? false : true;
    actionSegmentClick(somethingSelected ? id : -1);
    setSelectedId(somethingSelected ? id : null);
  }

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
              <b>Time</b>: {timeString}
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
              style={{ width: "100%" }}
              step="1"
              min="0"
              max={max}
              value={value}
              onChange={(e) => {
                const v = +e.target.value;
                const { dt, wind_deg } = weather[v];
                setValue(v);
                setTimeString(formatDate(dt));
                actionNewWindDirection(wind_deg);
              }}
              type="range"
            />
          </div>
        </>
      )}

      <div>
        <div>
          <span>⭐️ {segments.length} segments loaded </span>
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
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "5px",
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
