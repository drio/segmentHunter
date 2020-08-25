import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import nextCookie from "next-cookies";
import Router from "next/Router";
import segments from "../data/segments/all.json";
import weather from "../data/weather/hourly.json";
import WeatherSlider from "../components/weather_slider";
import Layout from "../components/layout";

// FIXME:
const CLIENT_ID = 52300;
const REDIRECT_PATH = `/exchange_token`;
const OAUTH_URL = `http://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost/${REDIRECT_PATH}&approval_prompt=force&scope=read`;

const sc_segments_only = segments.filter(s => s.state == "SC");

const importMap = () => import("../components/map");
const Map = dynamic(importMap, {
  ssr: false
});

const App = ({ access_token }) => {
  const [windDirection, setWindDirection] = useState("N");

  useEffect(() => {
    if (!access_token) Router.push(OAUTH_URL);
  }, []);

  return (
    <Layout>
      This is the app.
      {/*
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
      */}
    </Layout>
  );
};

export async function getStaticProps(ctx) {
  const cookies = nextCookie(ctx);
  return {
    props: {
      //access_token: cookies.access_token ? cookies.access_token : false
      access_token: "xxxxxxxxx"
    }
  };
}

export default App;
