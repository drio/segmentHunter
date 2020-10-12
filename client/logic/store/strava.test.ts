import { Observable, BehaviorSubject, of, from } from "rxjs";
import { take } from "rxjs/operators";

import { loadStravaData } from "./strava";
import { genStravaObservables } from "./helpers";
import { Segment } from "../types";
//import starredSegmentsTestData from "./testdata/starred.json";

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

describe("store/strava", () => {
  xit("We don't have segments in local storage", (done) => {
    const [subjectSegments, segments$] = genStravaObservables();

    const subjectMustLogin = new BehaviorSubject<boolean>(false);
    const mustLogin$ = subjectMustLogin.asObservable();

    loadStravaData({ stravaToken: "token", subjectSegments, subjectMustLogin });
    expect(true).toBe(true);
    done();
  });
});
