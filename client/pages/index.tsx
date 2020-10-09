import React from "react";
import dynamic from "next/dynamic";
import { sessionLoader } from "../logic/session";
import Layout from "../components/layout";
import Login from "../components/login";
import Loading from "../components/loading";
import Controls from "../components/controls";
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

const App = ({ profile, store }: AppProps): JSX.Element => {
  const segments = useObservable(store.getSegments(), []);
  const selectedSegment = useObservable(store.getSelectedSegment(), []);
  const weatherData = useObservable(store.getWeatherData(), []);
  const windAngle = useObservable(store.getWindAngle());
  const location = useObservable(store.getLocation(), {});

  const mustLogin = useObservable(store.getMustLogin());
  const loading = useObservable(store.getLoading(), true);

  const closeSegments = onlyCloseSegments(location, segments);

  // FIXME: emit segments in the observable instead of arrays
  const selectedSegmentSingle =
    selectedSegment && selectedSegment.length > 0 ? selectedSegment[0] : null;

  if (mustLogin) return <Login />;

  if (loading) return <Loading />;

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
};

App.getInitialProps = sessionLoader;
export default App;
