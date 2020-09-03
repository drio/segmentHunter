import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { sessionLoader } from "../logic/session";
import WeatherSlider from "../components/weather_slider";
import Layout from "../components/layout";
import Login from "../components/login";
import Error from "../components/error";
import Loading from "../components/loading";
import { stravaLoader, weatherLoader } from "../logic/data_loader";
import { getLocation, storeLocation } from "../logic/location";

const importMap = () => import("../components/map");
const Map = dynamic(importMap, {
  ssr: false
});

const App = props => {
  const { access_token, username, profile, loggedIn } = props;
  const [windDirection, setWindDirection] = useState(0);
  const [loadingSegments, setLoadingSegments] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [haveToLoadData, setHaveToLoadData] = useState(true);
  const [segments, setSegments] = useState([]);
  const [weather, setWeather] = useState([]);
  const [error, setError] = useState("");
  const [localCoordinates, setLocalCoordinates] = useState(null);
  const [mapCenterCoordinates, setMapCenterCoordinates] = useState({});

  const waitingForData = loadingWeather || loadingSegments;

  const handleUpdateInLocation = () => {
    const { latitude, longitude } = mapCenterCoordinates;
    if (latitude && longitude) storeLocation(mapCenterCoordinates);
  };

  const handleUpdateMapCenter = ({ latitude, longitude }) => {
    if (latitude && longitude) {
      setMapCenterCoordinates({ latitude, longitude });
    }
  };

  const handleError = (e, errorKey) => {
    console.log(e);
    setError(errorKey);
    setHaveToLoadData(false);
  };

  useEffect(() => {
    if (access_token && haveToLoadData) {
      getLocation()
        .then(coordinates => {
          weatherLoader(coordinates)
            .then(d => {
              setWeather(d);
              setWindDirection(d[0].windDirection);
              setLoadingWeather(false);

              stravaLoader(access_token)
                .then(d => {
                  setSegments(d);
                  setLoadingSegments(false);
                  setLocalCoordinates(coordinates);
                  setHaveToLoadData(false);
                })
                .catch(e => handleError(e, "segment"));
            })
            .catch(e => handleError(e, "weather"));
        })
        /* We don't have a current location,
           The user will have to set it up manually.
         */
        .catch(e => handleError(e, "location"));
    }
  }, []);

  if (error) {
    return <Error errorDetailKey={error} />;
  }

  if (loggedIn && waitingForData) {
    return <Loading />;
  } else {
    return (
      <Layout
        props={{
          ...props,
          ...{ loading: loadingSegments || loadingWeather }
        }}
      >
        {loggedIn ? (
          <>
            <WeatherSlider
              segments={segments}
              weather={weather}
              username={username}
              profile={profile}
              onUpdateLocation={handleUpdateInLocation}
              changeAction={e => {
                if (e) setWindDirection(e.windDirection);
              }}
            />
            <Map
              segments={segments}
              localCoordinates={localCoordinates}
              windDirection={windDirection}
              onCenterUpdate={handleUpdateMapCenter}
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
