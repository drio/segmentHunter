import React, { useState, useEffect } from "react";
import { sessionLoader } from "../logic/session";
import Layout from "../components/layout";
import Login from "../components/login";
import { Segment } from "../logic/types";
import { useObservable } from "../logic/utils";

interface AppProps {
  access_token: string;
  username: string;
  profile: string;
  loggedIn: boolean;
  store: any;
}

const App = ({ loggedIn, username, store }: AppProps): JSX.Element => {
  const segments = useObservable(store.getSegments(), []);
  const selectedSegment = useObservable(store.getSelectedSegment(), []);
  const mustLogin = useObservable(store.getMustLogin());
  const loading = useObservable(store.getLoading(), true);

  if (loading) {
    return (
      <Layout>
        <div>Loading ...</div>
      </Layout>
    );
  }

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

  return !loggedIn || mustLogin ? (
    <Login />
  ) : (
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
