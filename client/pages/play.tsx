import React, { useState, useEffect } from "react";
import { sessionLoader } from "../logic/session";
import Layout from "../components/layout";
import Login from "../components/login";
import { Segment } from "../logic/types";
import {useObservable} from "../logic/utils";

interface AppProps {
  access_token: string;
  username: string;
  profile: string;
  loggedIn: boolean;
  store: any;
}

function weatherURL() {
  const { latitude, longitude } = {
    latitude: 32.785090897232294,
    longitude: -79.84943764284253,
  };
  return (
    "https://api.openweathermap.org/data/2.5/onecall" +
    `?lat=${latitude}&lon=${longitude}` +
    `&APPID=92f710577a529b24207f0d0c0b3e0971` +
    `&exclude=minutely&current&units=metric`
  );
}

const App = ({ loggedIn, username, store }: AppProps): JSX.Element => {
  const segments = useObservable(store.getSegments());
  const selectedSegment = useObservable(store.getSelectedSegment());
  const mustLogin = useObservable(store.getMustLogin());
  console.log(mustLogin);

  let liEntries = <li>-</li>;
  if (segments) {
    liEntries = segments
    .map(s => s)
    .sort((a, b) => a.distance > b.distance ? -1 : 1)
    .map((s) => (
      <li key={s.id}>
        <a href="#" onClick={() => store.setSelectedSegment(s.id)}> {s.name}></a> 
        ({s.distance} km)
      </li>
    ));
  }

  return (!loggedIn || mustLogin) ? ( <Login />) : (
    <Layout>
      <div style={{ margin: "50px" }}>
        <p>
          🔥 {loggedIn} {username}
        </p>
        <p>
          Selected segment:{" "}
          {selectedSegment && selectedSegment.length > 0
            ? selectedSegment[0].name
            : "-"}
        </p>
        <hr />
        <h1>Segments: </h1>
        <ul>{liEntries}</ul>
        <hr />
        <p>Location: </p>
        <p>Weather Data: </p>
      </div>
    </Layout>
  );
};

App.getInitialProps = sessionLoader;
export default App;
