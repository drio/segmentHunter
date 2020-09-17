import {Coordinate, WeatherEntry, LocalStorageWeather, Segment}  from "./types";

const STRAVA_API_URL = "https://www.strava.com/api/v3/segments";
const OPEN_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/onecall";
const LOCAL_KEY_SEGMENTS = "segment_hunter_segments";
const LOCAL_KEY_WEATHER = "segment_hunter_weather";
const HOURS_MS_24 = 60 * 60 * 24 * 1000;
const H_HOURS = (h: number) => 60 * 60 * h * 1000;
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

/* 
We need the following attributes on the weather entries:
	- temperature,   (celsius)
	- windAngle, (degrees)
	- windSpeed,     (meters/sec)
	- shortForecast, (string)
	- startTime      (unix timestamp)
*/

function generateOpenWeatherURL(latitude:number, longitude:number) {
  return (
    `${OPEN_WEATHER_API_URL}` +
    `?lat=${latitude}&lon=${longitude}` +
    `&APPID=${OPEN_WEATHER_KEY}` +
    `&exclude=minutely&current&units=metric`
  );
}

async function openWeatherLoader(coordinates: Coordinate, fetchFn = fetch): Promise<WeatherEntry[]> {
  let error: null | string = null;
  let weatherEntries: WeatherEntry[];
  let storedWeather: LocalStorageWeather | null = null;
  const { latitude, longitude } = coordinates;
  const now = +new Date();

  if (!latitude || !longitude) {
    error = "No coordinates provided for loading weather";
  }

  if (!error) {
    const storageResult = localStorage.getItem(LOCAL_KEY_WEATHER)
    storedWeather = storageResult ? JSON.parse(storageResult) : null;

    if (storedWeather && now - storedWeather.timestamp < H_HOURS(1)) {
      console.log("Using weather data from local storage.");
      weatherEntries = storedWeather.weather;
    } else {
      const fetchOpts = { headers: { accept: "application/json" } };
      const url = generateOpenWeatherURL(latitude, longitude);
      const response = await fetchFn(url, fetchOpts);
      if (response.status === 200) {
        const json = await response.json();
        weatherEntries = json.hourly;
        localStorage.setItem(
          LOCAL_KEY_WEATHER,
          JSON.stringify({
            timestamp: now,
            weather: weatherEntries
          })
        );
      } else {
        error = `Failure requesting open weather data. Response:  ${response.status}`;
      }

    }
  }

  return new Promise((resolve, reject) => {
    error ? reject(error) : resolve(weatherEntries);
  });
}

async function stravaLoader(token: string, fetchFn = fetch): Promise<Segment[]> {
  let segmentDetailsList: Segment[] = [];
  let error: string | null;
  const now = +new Date();
  let responseCode: number;

  const storageResult = localStorage.getItem(LOCAL_KEY_SEGMENTS)
  const localSegments = storageResult ? JSON.parse(storageResult) : null;

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
    responseCode = response.status
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
    error ? reject({error, responseCode}) : resolve(segmentDetailsList);
  });
}

export { openWeatherLoader as weatherLoader, stravaLoader, STRAVA_API_URL };
