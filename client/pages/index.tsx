import React from "react";
import dynamic from "next/dynamic";
import { sessionLoader } from "../logic/session";
import Layout from "../components/layout";
import Login from "../components/login";
import Loading from "../components/loading";
import Controls from "../components/controls";
import { useObservable } from "../logic/utils";
import { onlyCloseSegments } from "../logic/gis";
import { ErrorCode } from "../logic/store/types";

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
  const segments = useObservable(store.getSegments());
  const error = useObservable(store.getError(), null);
  const selectedSegment = useObservable(store.getSelectedSegment());
  const weatherData = useObservable(store.getWeatherData());
  const windAngle = useObservable(store.getWindAngle());
  const location = useObservable(store.getLocation());

  const mustLogin = useObservable(store.getMustLogin());
  const loading = useObservable(store.getLoading());

  const closeSegments = onlyCloseSegments(location, segments);

  if (error && error.code !== ErrorCode.Ok) {
    return (
      <Layout>
        <div className="center">Error</div>
      </Layout>
    );
  }

  if (mustLogin) return <Login />;

  if (loading) return <Loading />;
  return (
    <Layout>
      <Controls
        segments={closeSegments}
        weather={weatherData || []}
        profile={profile}
        actionSegmentClick={store.setSelectedSegment}
        actionNewWindDirection={store.setWindAngle}
      />
      <Map
        segments={closeSegments}
        location={location}
        windAngle={windAngle}
        onCenterUpdate={() => null}
        selectedSegment={selectedSegment}
      />
    </Layout>
  );
};

App.getInitialProps = sessionLoader;
export default App;
