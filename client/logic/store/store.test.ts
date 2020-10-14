import { of, NEVER, noop, BehaviorSubject, Subject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { createStore } from "./store";
import { Coordinate } from "../types";
import { genPosition, genWeatherEntries, genSegments } from "./ut_helpers";

describe("store", () => {
  describe("We haven't loaded anything yet", () => {
    const store = createStore();
    beforeEach(() => {
      const getPositionFn = (succ: PositionCallback) => succ(genPosition(1, 2));
      const subjectLocation = new BehaviorSubject<Coordinate | null>(null);
      /* We won't broadcast data to the observers */
      subjectLocation.next = noop;

      store.init("token", {
        subjectLocation,
        getPositionFn,
        weatherAjax$: NEVER,
        localDetailedSegments: [],
        newDetailedSegments$: NEVER,
      });
    });

    it("All the data streams are null ", (done) => {
      store.getLoading().subscribe((loading) => {
        expect(loading).toBe(true);
        combineLatest([
          store.getLocation(),
          store.getSegments(),
          store.getWeatherData(),
        ])
          .pipe(map(([l, s, w]) => !l && !s && !w))
          .subscribe((allAreNull) => {
            expect(allAreNull).toBe(true);
            done();
          });
      });
    });
  });

  describe("When we have loaded the location correctly", () => {
    const store = createStore();
    beforeEach(() => {
      const getPositionFn = (succ: PositionCallback) => succ(genPosition(1, 2));
      const subjectLocation = new BehaviorSubject<Coordinate | null>(null);

      store.init("token", {
        subjectLocation,
        getPositionFn,
        weatherAjax$: NEVER,
        localDetailedSegments: [],
        newDetailedSegments$: NEVER,
      });
    });

    it("We are still loading data (segments and weather)", (done) => {
      store.getLoading().subscribe((loading) => {
        expect(loading).toBe(true);
        store.getLocation().subscribe((loc) => {
          if (loc) {
            expect(loc.latitude).toBe(1);
            expect(loc.longitude).toBe(2);
            done();
          } else {
            done.fail();
          }
        });
      });
    });
  });

  describe("When we have loaded the location and weather correctly", () => {
    const store = createStore();
    beforeEach(() => {
      const getPositionFn = (succ: PositionCallback) => succ(genPosition(1, 2));
      const subjectLocation = new BehaviorSubject<Coordinate | null>(null);
      const weatherEntries = genWeatherEntries(3);

      store.init("token", {
        subjectLocation,
        getPositionFn,
        weatherAjax$: of(weatherEntries),
        localDetailedSegments: [],
        newDetailedSegments$: NEVER,
      });
    });

    it("We are still loading data (segments and weather)", (done) => {
      store.getLoading().subscribe((loading) => {
        expect(loading).toBe(true);
        store.getWeatherData().subscribe((data) => {
          if (data) {
            expect(data.length).toBe(3);
            expect(data[0].temp).toBe(0);
            expect(data[1].temp).toBe(1);
            expect(data[2].temp).toBe(2);
            done();
          } else {
            done.fail();
          }
        });
      });
    });
  });

  describe("When we have loaded ALL the data correctly", () => {
    const store = createStore();
    beforeEach(() => {
      const getPositionFn = (succ: PositionCallback) => succ(genPosition(1, 2));
      const subjectLocation = new BehaviorSubject<Coordinate | null>(null);
      const weatherEntries = genWeatherEntries(3);
      const allSegments = genSegments(2);

      store.init("token", {
        subjectLocation,
        getPositionFn,
        weatherAjax$: of(weatherEntries),
        localDetailedSegments: [],
        newDetailedSegments$: of(allSegments),
      });
    });

    it("We are not loading data anymore and the data in the stream is correct", (done) => {
      store.getLoading().subscribe((loading) => {
        expect(loading).toBe(false);
        store.getSegments().subscribe((segments) => {
          if (segments) {
            expect(segments.length).toBe(2);
            done();
          } else {
            done.fail();
          }
        });
      });
    });
  });

  describe("The segment selection logic", () => {
    let store: any;

    beforeEach(() => {
      store = createStore();
      const getPositionFn = (succ: PositionCallback) => succ(genPosition(1, 2));
      const subjectLocation = new BehaviorSubject<Coordinate | null>(null);
      const weatherEntries = genWeatherEntries(3);
      const allSegments = genSegments(10);

      store.init("token", {
        subjectLocation,
        getPositionFn,
        weatherAjax$: of(weatherEntries),
        localDetailedSegments: [],
        newDetailedSegments$: of(allSegments),
      });
    });

    it("It is null if nothing is selected", (done) => {
      store.getSelectedSegment().subscribe((ss) => {
        expect(ss).toBe(null);
        done();
      });
    });

    it("We broadcast the selected segment ", (done) => {
      store.setSelectedSegment(3);
      store.getSelectedSegment().subscribe((ss) => {
        expect(ss).not.toBe(null);
        if (ss) {
          expect(ss.id).toBe(3);
          done();
        }
      });
    });

    it("The stream is null when we de-select a segment ", (done) => {
      store.setSelectedSegment(3);
      store.setSelectedSegment(3);
      store.getSelectedSegment().subscribe((ss) => {
        expect(ss).toBe(null);
        done();
      });
    });

    it("The stream is null when we de-select a segment (-1 method)", (done) => {
      store.setSelectedSegment(3);
      store.setSelectedSegment(-1);
      store.getSelectedSegment().subscribe((ss) => {
        expect(ss).toBe(null);
        done();
      });
    });
  });
});
