import React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { sessionLoader } from "../logic/session";
import { Coordinate, WeatherEntry, Segment } from "../logic/types";
import { onlyCloseSegments } from "../logic/gis";
import Controls from "../components/controls";
import Layout from "../components/layout";
import Login from "../components/login";
import Error from "../components/error";
import Loading from "../components/loading";
import { stravaLoader, weatherLoader } from "../logic/data_loader";
import { getLocation, storeLocation } from "../logic/location";

const importMap = () => import("../components/map");
const Map = dynamic(importMap, {
  ssr: false,
});

interface AppProps {
  access_token: string;
  username: string;
  profile: string;
  loggedIn: boolean;
}

const App = (props: AppProps): JSX.Element => {
  const { access_token, username, profile, loggedIn } = props;
  const [windAngle, setWindAngle] = useState(0);
  const [loadingSegments, setLoadingSegments] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [haveToLoadData, setHaveToLoadData] = useState(true);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [weather, setWeather] = useState<WeatherEntry[]>([]);
  const [error, setError] = useState("");
  const [localCoordinates, setLocalCoordinates] = useState<Coordinate | null>(
    null
  );
  const [mapCenterCoordinates, setMapCenterCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  const waitingForData = loadingWeather || loadingSegments;

  const handleUpdateInLocation = () => {
    const { latitude, longitude } = mapCenterCoordinates;
    if (latitude && longitude) storeLocation(mapCenterCoordinates);
  };

  const handleUpdateMapCenter = (c: Coordinate): void => {
    const { latitude, longitude } = c;
    if (latitude && longitude) {
      setMapCenterCoordinates({ latitude, longitude });
    }
  };

  const handleError = (e: Error, errorKey: string) => {
    console.log(e);
    setError(errorKey);
    setHaveToLoadData(false);
  };

  useEffect(() => {
    if (access_token && haveToLoadData) {
      getLocation()
        .then((coordinates) => {
          weatherLoader(coordinates)
            .then((d: WeatherEntry[]) => {
              setWeather(d);
              setWindAngle(d[0].wind_deg);
              setLoadingWeather(false);

              stravaLoader(access_token)
                .then((d: Segment[]) => {
                  setSegments(d);
                  setLoadingSegments(false);
                  setLocalCoordinates(coordinates);
                  setHaveToLoadData(false);
                })
                .catch((e) => handleError(e, "segment"));
            })
            .catch((e) => handleError(e, "weather"));
        })
        .catch((e) => handleError(e, "location"));
    }
  }, []);

  if (error) {
    return <Error errorDetailKey={error} />;
  }

  if (loggedIn && waitingForData && mapCenterCoordinates) {
    return <Loading />;
  } else {
    const localSegments = mapCenterCoordinates
      ? onlyCloseSegments(mapCenterCoordinates, segments)
      : segments;
    return (
      <Layout
        props={{
          ...props,
          ...{ loading: loadingSegments || loadingWeather },
        }}
      >
        {loggedIn ? (
          <>
            <Controls
              segments={localSegments}
              weather={weather}
              username={username}
              profile={profile}
              onUpdateLocation={handleUpdateInLocation}
              onSegmentClick={(seg) => setSelectedSegment(seg)}
              changeAction={(e) => {
                if (e) setWindAngle(e.windAngle);
              }}
            />
            <Map
              segments={localSegments}
              localCoordinates={localCoordinates}
              windAngle={windAngle}
              onCenterUpdate={handleUpdateMapCenter}
              selectedSegment={selectedSegment}
            />
          </>
        ) : (
          <Login />
        )}
      </Layout>
    );
  }
};

App.getInitialProps = sessionLoader;
export default App;
