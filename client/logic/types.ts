export interface Coordinate {
  latitude: number,
  longitude: number
}

export interface GeoResult {
  coords:  Coordinate
}

export interface Segment {
  start_latitude: number, 
  start_longitude: number, 
  end_latitude: number, 
  end_longitude: number
}
