import { Observable, BehaviorSubject, Subject } from "rxjs";
import { WeatherEntry, Segment, Coordinate } from "../types";

export interface GetPosFunction {
  (
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ): void;
}

export interface LoadStravaParams {
  stravaToken: string | null;
  subjectSegments: BehaviorSubject<Segment[] | null>;
  localDetailedSegmentsMock?: Segment[] | null;
  newDetailedSegmentsMock$?: Observable<Segment[]> | null;
}

export interface InitMockFunctions {
  subjectLocation?: BehaviorSubject<Coordinate | null>;
  getPositionFn?: GetPosFunction | null;
  weatherAjax$?: Observable<WeatherEntry[]>;
  localDetailedSegments?: Segment[] | null;
  newDetailedSegments$?: Observable<Segment[]> | null;
}
