import React from "react";
import dynamic from "next/dynamic";
import { sessionLoader } from "../logic/session";
import Layout from "../components/layout";
import Login from "../components/login";
import Controls from "../components/controls";
import { Segment } from "../logic/types";
import { useObservable } from "../logic/utils";
import { onlyCloseSegments } from "../logic/gis";

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

const testModeON = true;

const App = ({ loggedIn, username, profile, store }: AppProps): JSX.Element => {
  const segments = useObservable(store.getSegments(), []);
  const selectedSegment = useObservable(store.getSelectedSegment(), []);
  const weatherData = useObservable(store.getWeatherData(), []);
  const windAngle = useObservable(store.getWindAngle());
  const location = useObservable(store.getLocation(), {});
  const mustLogin = useObservable(store.getMustLogin());
  const loading = useObservable(store.getLoading(), true);
  const closeSegments = onlyCloseSegments(location, segments);

  // FIXME: emit sements in the observable instead of arrays
  const selectedSegmentSingle =
    selectedSegment && selectedSegment.length > 0 ? selectedSegment[0] : null;

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
        <Controls
          segments={closeSegments}
          weather={weatherData}
          profile={profile}
          actionSegmentClick={store.setSelectedSegment}
          actionNewWindDirection={store.setWindAngle}
        />

        <p>
          🔥 {loggedIn} {username}
        </p>
        <p>Weather Data: {weatherData.length}</p>
        <p>Wind Angle: {windAngle}</p>
        <p>
          Location: {location.latitude} {location.longitude}
        </p>

        <p>
          Selected segment:{" "}
          {selectedSegmentSingle ? selectedSegmentSingle.name : "-"}
        </p>
        <hr />
        <h1>Segments: </h1>
        <ul>{liEntries}</ul>
        <hr />
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

  if (testModeON) {
    return testComp();
  } else {
    return (
      <Layout>
        <Controls
          segments={closeSegments}
          weather={weatherData}
          profile={profile}
          actionSegmentClick={store.setSelectedSegment}
          actionNewWindDirection={store.setWindAngle}
        />
        <Map
          segments={closeSegments}
          localCoordinates={location}
          windAngle={windAngle}
          onCenterUpdate={() => null}
          selectedSegment={selectedSegmentSingle}
        />
      </Layout>
    );
  }
};

App.getInitialProps = sessionLoader;
export default App;
