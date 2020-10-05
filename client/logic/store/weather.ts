import { BehaviorSubject } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { Coordinate } from "../types";
import { WeatherEntry } from "../types";

const OPEN_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/onecall";
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

function generateOpenWeatherURL(location: Coordinate) {
  return (
    `${OPEN_WEATHER_API_URL}` +
    `?lat=${location.latitude}&lon=${location.longitude}` +
    `&APPID=${OPEN_WEATHER_KEY}` +
    `&exclude=minutely&current&units=metric`
  );
}

function loadWeatherData(
  location: Coordinate,
  subjectWeather: BehaviorSubject<WeatherEntry[]>
): void {
  const inTheBrowser = typeof window !== "undefined";
  if (!inTheBrowser) return;

  const url = generateOpenWeatherURL(location);
  ajax(url)
    .pipe(map(({ response }) => response.hourly))
    .subscribe(
      (hourlyWeatherData) => subjectWeather.next(hourlyWeatherData),
      (error) => console.log(error),
      () => subjectWeather.complete()
    );
}

export { loadWeatherData };
