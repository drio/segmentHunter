import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Segment } from "../types";
import { loadStravaData } from "./strava";

const store = (function () {
  const subjectSegments = new BehaviorSubject<Segment[]>([]);
  const segments$: Observable<Segment[]> = subjectSegments.asObservable();

  const subjectSelectedSegment = new BehaviorSubject<Segment[]>([]);
  const selectedSegment$: Observable<
    Segment[]
  > = subjectSelectedSegment.asObservable();

  const subjectMustLogin = new BehaviorSubject<boolean>(false);
  const mustLogin$: Observable<boolean> = subjectMustLogin.asObservable();

  function init(stravaToken: string | null) {
    loadStravaData(stravaToken, subjectSegments, subjectMustLogin);
  }

  const getSegments = () => segments$;

  const getSelectedSegment = () => selectedSegment$;

  const getMustLogin = () => mustLogin$;

  function setSelectedSegment(id: number) {
    const filteredSegments = subjectSegments
      .getValue()
      .filter((s) => s.id === id);

    const currentSelectedId = subjectSelectedSegment.getValue();
    const selectingSameSegment =
      currentSelectedId.length > 0 && currentSelectedId[0].id === id;

    if (id === -1 || selectingSameSegment) {
      subjectSelectedSegment.next([]);
      return;
    }

    if (filteredSegments.length === 1) {
      segments$
        .pipe(map((listSegments) => listSegments.find((s) => s.id === id)))
        .subscribe((s) => s && subjectSelectedSegment.next([s]));
    }
  }

  return {
    init,
    getSegments,
    setSelectedSegment,
    getSelectedSegment,
    getMustLogin,
  };
})();

export default store;
