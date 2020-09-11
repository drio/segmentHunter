export interface Coordinate {
  latitude: number,
  longitude: number
}

export interface GeoResult {
  coords:  Coordinate
}

export interface Segment {
  id: number,
  start_latitude: number, 
  start_longitude: number, 
  end_latitude: number, 
  end_longitude: number
  name: string,
  map: {
    polyline: string
  }
  distance: number
}

export interface LocalStorageWeather {
  timestamp: number,
  weather: WeatherEntry[],
}

export interface WeatherEntry {
  startTime: number,
  temp: number,
  wind_deg: number,
  wind_speed: number,
  weather: {
    description: string,
  },
  dt: number
}
