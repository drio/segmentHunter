import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import nextCookie from "next-cookies";
import Router from "next/Router";

import WeatherSlider from "../components/weather_slider";
import Layout from "../components/layout";
import { stravaLoader, weatherLoader } from "../logic/data_loader";
import getLocation from "../logic/get_location";

import segments from "../data/segments/all.json";
//import weather from "../data/weather/hourly.json";

const sc_segments_only = segments.filter(s => s.state == "SC");

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const OAUTH_URL = `http://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=read`;

const importMap = () => import("../components/map");
const Map = dynamic(importMap, {
  ssr: false
});

const App = ({ access_token, username, profile }) => {
  const [windDirection, setWindDirection] = useState("N");
  const [loadingSegments, setLoadingSegments] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  //const [segments, setSegments] = useState([]);
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    if (!access_token) {
      Router.push(OAUTH_URL);
    }
    getLocation().then(coordinates => {
      weatherLoader(coordinates)
        .then(d => {
          console.log("weather: ", d);
          setWeather(d);
          setLoadingWeather(false);
        })
        .catch(e => {
          console.log("", e);
        });
    });
    stravaLoader(access_token).then(d => {
      console.log("segments: ", d);
      //setSegments(d);
      setLoadingSegments(false);
    });
  }, []);

  if (access_token) {
    if (loadingWeather || loadingSegments) {
      return (
        <Layout>
          <div>Loading weather {loadingWeather ? " ... " : " done."}</div>
          <div>Loading segments {loadingSegments ? " ... " : " done."}</div>
        </Layout>
      );
    } else {
      return (
        <Layout>
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
        </Layout>
      );
    }
  } else {
    null;
  }
};

App.getInitialProps = async ctx => {
  const cookies = nextCookie(ctx);
  return {
    access_token: cookies.segment_hunter_access_token || null,
    username: cookies.segment_hunter_username || null,
    profile: cookies.segment_hunter_profile || null
  };
};

export default App;
