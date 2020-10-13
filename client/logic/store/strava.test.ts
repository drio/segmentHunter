import { BehaviorSubject, of, throwError } from "rxjs";

import { loadStravaData } from "./strava";
import { genStravaObservables } from "./helpers";
import { Segment } from "../types";

/*
TODO: Not completely happy witht these tests. We are not exercising all 
the observables for the strava logic. 
*/

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
  it("We the mustLogin$ is true when failing to retrieve segments", (done) => {
    const [subjectSegments, segments$] = genStravaObservables();
    const subjectMustLogin = new BehaviorSubject<boolean>(false);
    const mustLogin$ = subjectMustLogin.asObservable();
    const localDetailedSegmentsMock = [];
    const newDetailedSegmentsMock$ = throwError("Some type of error");

    loadStravaData({
      stravaToken: "token",
      subjectSegments,
      subjectMustLogin,
      localDetailedSegmentsMock,
      newDetailedSegmentsMock$,
    });

    segments$.subscribe(
      (listSegments) => {
        expect(listSegments.length).toBe(0);
        mustLogin$.subscribe((v) => {
          expect(v).toBe(true);
          done();
        });
      },
      () => done.fail(),
      () => done.fail()
    );
  });

  it("we have 5 segments locally and 1 new segment", (done) => {
    const [subjectSegments, segments$] = genStravaObservables();
    const subjectMustLogin = new BehaviorSubject<boolean>(false);
    const mustLogin$ = subjectMustLogin.asObservable();
    const allSegments = genSegments(6);
    const localDetailedSegmentsMock = allSegments.slice(0, 5);
    const newDetailedSegmentsMock$ = of(allSegments.slice(5, 6));

    loadStravaData({
      stravaToken: "token",
      subjectSegments,
      subjectMustLogin,
      localDetailedSegmentsMock,
      newDetailedSegmentsMock$,
    });

    segments$.subscribe(
      (listSegments) => {
        expect(listSegments.length).toBe(6);
        mustLogin$.subscribe((v) => {
          expect(v).toBe(false);
          done();
        });
      },
      () => done.fail(),
      () => done.fail()
    );
  });

  it("we have 6 segments locally and 0 new segments", (done) => {
    const [subjectSegments, segments$] = genStravaObservables();
    const subjectMustLogin = new BehaviorSubject<boolean>(false);
    const mustLogin$ = subjectMustLogin.asObservable();
    const allSegments = genSegments(6);
    const localDetailedSegmentsMock = allSegments;
    const newDetailedSegmentsMock$ = of([]);

    loadStravaData({
      stravaToken: "token",
      subjectSegments,
      subjectMustLogin,
      localDetailedSegmentsMock,
      newDetailedSegmentsMock$,
    });

    segments$.subscribe(
      (listSegments) => {
        expect(listSegments.length).toBe(6);
        mustLogin$.subscribe((v) => {
          expect(v).toBe(false);
          done();
        });
      },
      () => done.fail(),
      () => done.fail()
    );
  });

  it("we have 0 segments locally and 6 new segments", (done) => {
    const [subjectSegments, segments$] = genStravaObservables();
    const subjectMustLogin = new BehaviorSubject<boolean>(false);
    const mustLogin$ = subjectMustLogin.asObservable();
    const allSegments = genSegments(6);
    const localDetailedSegmentsMock = [];
    const newDetailedSegmentsMock$ = of(allSegments);

    loadStravaData({
      stravaToken: "token",
      subjectSegments,
      subjectMustLogin,
      localDetailedSegmentsMock,
      newDetailedSegmentsMock$,
    });

    segments$.subscribe(
      (listSegments) => {
        expect(listSegments.length).toBe(6);
        mustLogin$.subscribe((v) => {
          expect(v).toBe(false);
          done();
        });
      },
      () => done.fail(),
      () => done.fail()
    );
  });
});
