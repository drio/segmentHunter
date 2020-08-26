const STRAVA_API_URL = "https://www.strava.com/api/v3/segments";
const WEATHER_API_URL = "https://api.weather.gov/points";
const LOCAL_KEY_SEGMENTS = "segment_hunter_segments";
const LOCAL_KEY_WEATHER = "segment_hunter_weather";
const HOURS_MS_24 = 60 * 60 * 24 * 1000;
const ONE_HOUR = 60 * 60 * 1 * 1000;

async function weatherLoader(coordinates, fetchFn = fetch) {
  let error = false;
  let hourly;
  const now = +new Date();
  const localStorageWeather = JSON.parse(
    localStorage.getItem(LOCAL_KEY_WEATHER)
  );

  if (localStorageWeather && now - localStorageWeather.timestamp < ONE_HOUR) {
    console.log("Using weather data from local storage.");
    hourly = localStorageWeather.weather;
  } else {
    let response, json;
    const { latitude, longitude } = coordinates;
    const fetchOpts = { headers: { accept: "application/json" } };

    const url = `${WEATHER_API_URL}/${latitude},${longitude}`;
    response = await fetchFn(url, fetchOpts);
    if (response.status === 200) {
      json = await response.json();
      // FIXME: we may not have those keys
      const hourlyURL = json.properties.forecastHourly;
      response = await fetchFn(hourlyURL, fetchOpts);
      if (response.status === 200) {
        json = await response.json();
        hourly = json.properties.periods;
      } else {
        error = `Failed on second weather request ${response.status}`;
      }
    } else {
      error = `Failed on first weather request ${response.status}`;
    }

    localStorage.setItem(
      LOCAL_KEY_WEATHER,
      JSON.stringify({
        timestamp: now,
        weather: hourly
      })
    );
  }

  return new Promise((resolve, reject) => {
    error ? reject(error) : resolve(hourly);
  });
}

async function stravaLoader(token, fetchFn = fetch) {
  let segmentDetailsList = [];
  let error = false;
  const now = +new Date();
  const localSegments = JSON.parse(localStorage.getItem(LOCAL_KEY_SEGMENTS));

  if (localSegments && now - localSegments.timestamp < HOURS_MS_24) {
    console.log("Using strava segments from local storage.");
    segmentDetailsList = localSegments.segments;
  } else {
    const fetchOpts = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`
      }
    };

    const response = await fetchFn(`${STRAVA_API_URL}/starred`, fetchOpts);
    if (response.status === 200) {
      const listSegments = await response.json();
      for (let i = 0; i < listSegments.length; i++) {
        const s = listSegments[i];
        const response = await fetchFn(`${STRAVA_API_URL}/${s.id}`, fetchOpts);
        if (response.status === 200) {
          const segDetails = await response.json();
          segmentDetailsList.push(segDetails);
        } else {
          error = `Couldn't load segment ${s.id}`;
        }
      }
    } else {
      error = `Couldn't load starred segments ${response.status}`;
    }

    localStorage.setItem(
      LOCAL_KEY_SEGMENTS,
      JSON.stringify({
        timestamp: now,
        segments: segmentDetailsList
      })
    );
  }

  return new Promise((resolve, reject) => {
    error ? reject(error) : resolve(segmentDetailsList);
  });
}

export { weatherLoader, stravaLoader, STRAVA_API_URL };
