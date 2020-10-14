import { WeatherEntry, Segment } from "../types";

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
      temp: i,
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

function genSegments(n: number): Segment[] {
  const list: Segment[] = [];
  for (let i = 0; i < n; i++) {
    list.push({
      id: i,
      start_latitude: Math.random(),
      start_longitude: Math.random(),
      end_latitude: Math.random(),
      end_longitude: Math.random(),
      name: `name_${i}`,
      map: {
        polyline: "Poly here",
      },
      distance: Math.random(),
    });
  }
  return list;
}

export { genPosition, genWeatherEntries, genSegments };
