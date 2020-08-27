import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import nextCookie from "next-cookies";
import Router from "next/Router";

import WeatherSlider from "../components/weather_slider";
import Layout from "../components/layout";
import Error from "../components/error";
import Loading from "../components/loading";
import { stravaLoader, weatherLoader } from "../logic/data_loader";
import getLocation from "../logic/get_location";
import onlyLocalSegments from "../logic/gis";

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
  const [segments, setSegments] = useState([]);
  const [weather, setWeather] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!access_token) {
      console.log("Starting OAUTH process ...");
      Router.push(OAUTH_URL);
    }
    if (access_token) {
      getLocation().then(coordinates => {
        weatherLoader(coordinates)
          .then(d => {
            setWeather(d);
            setLoadingWeather(false);

            stravaLoader(access_token)
              .then(d => {
                console.log(onlyLocalSegments(coordinates, d));
                setSegments(onlyLocalSegments(coordinates, d));
                setLoadingSegments(false);
              })
              .catch(e => {
                setError("Problem loading segment data.");
              });
          })
          .catch(e => {
            setError("Problem loading weather data.");
          });
      });
    }
  }, []);

  if (error) {
    return <Error msg={error} />;
  }

  if (access_token) {
    if (loadingWeather || loadingSegments) {
      return <Loading />;
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
              segments={segments}
              weather={weather}
              windDirection={windDirection}
            />
          </div>
        </Layout>
      );
    }
  } else {
    return null;
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
