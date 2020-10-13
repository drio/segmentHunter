import { WeatherEntry } from "../types";

function genPosition(latitude: number, longitude: number): Position {
  return {
    coords: {
      latitude,
      longitude,
      accuracy: 1,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 1,
  };
}

function genWeatherEntries(n: number): WeatherEntry[] {
  const list: WeatherEntry[] = [];
  for (let i = 0; i < n; i++) {
    list.push({
      temp: 1,
      wind_deg: 1,
      wind_speed: 1,
      weather: {
        description: `desc_${i}`,
      },
      dt: 1,
    });
  }
  return list;
}

export { genPosition, genWeatherEntries };
