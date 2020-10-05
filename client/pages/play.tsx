import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { sessionLoader } from "../logic/session";
import Layout from "../components/layout";
import Login from "../components/login";
import Controls from "../components/controls";
import { Segment, WeatherEntry } from "../logic/types";
import { useObservable } from "../logic/utils";

const importMap = () => import("../components/map");
const Map = dynamic(importMap, {
  ssr: false,
});

interface AppProps {
  access_token: string;
  username: string;
  profile: string;
  loggedIn: boolean;
  store: any;
}

const App = ({ loggedIn, username, profile, store }: AppProps): JSX.Element => {
  const segments = useObservable(store.getSegments(), []);
  const selectedSegment = useObservable(store.getSelectedSegment(), []);
  const weatherData = useObservable(store.getWeatherData(), []);
  const location = useObservable(store.getLocation(), {});
  const mustLogin = useObservable(store.getMustLogin());
  const loading = useObservable(store.getLoading(), true);

  // FIXME: emit sements in the observable instead of arrays
  const selectedSegmentSingle =
    selectedSegment && selectedSegment.length > 0
      ? selectedSegment[0].name
      : null;

  const testComp = () => {
    let liEntries = <li>-</li>;
    liEntries = segments
      .map((s: Segment) => s)
      .sort((a: Segment, b: Segment) => (a.distance > b.distance ? -1 : 1))
      .map((s: Segment) => (
        <li key={s.id}>
          <a href="#" onClick={() => store.setSelectedSegment(s.id)}>
            {" "}
            {s.name}
          </a>
          ({s.distance} km)
        </li>
      ));

    return (
      <div style={{ margin: "50px" }}>
        <p>
          🔥 {loggedIn} {username}
        </p>
        <p>Weather Data: {weatherData.length}</p>

        <p>
          Selected segment:{" "}
          {selectedSegmentSingle ? selectedSegmentSingle[0].name : "-"}
        </p>
        <hr />
        <h1>Segments: </h1>
        <ul>{liEntries}</ul>
        <hr />
        <p>Location: </p>
        <p>Weather Data: </p>
      </div>
    );
  };

  if (mustLogin) {
    return <Login />;
  }

  if (loading) {
    return (
      <Layout>
        <div>Loading ...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Controls
        segments={segments}
        weather={weatherData}
        username={username}
        profile={profile}
        onUpdateLocation={() => console.log("update location")}
        onSegmentClick={(seg: number) => console.log("click", seg)}
        changeAction={(e: WeatherEntry) => console.log(e)}
      />
      <Map
        segments={segments}
        localCoordinates={location}
        windAngle={0}
        onCenterUpdate={() => null}
        selectedSegment={selectedSegmentSingle}
      />
    </Layout>
  );
};

App.getInitialProps = sessionLoader;
export default App;
