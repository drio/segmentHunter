import store from "./store";
import { defaultLocation } from "./location";
import { Coordinate } from "../types";

/*
function mockGeoLocation(errorMsg = "") {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn((success, error) => {
      return errorMsg.length > 0
        ? Promise.resolve(error("xxx"))
        : Promise.resolve(
            success({
              coords: defaultLocation,
            })
          );
    }),
  };
}
*/

describe("store/location", () => {
  xit("we get an error if the browser is not supported", (done) => {
    store.init("STRAVA_TOKEN");
    let error = false;
    store.getLocation().subscribe(
      () => done(),
      () => {
        error = true;
        done();
      }
    );
    expect(error).toBe(true);
  });

  xit("we ge the default location if we cannot get the geolocation", (done) => {
    //mockGeoLocation("The browser couldn't get the location");
    store.init("STRAVA_TOKEN");
    let error = false;
    let location = { latitude: 0, longitude: 0 };

    store.getLocation().subscribe(
      (l) => {
        location = l;
        done();
      },
      () => {
        error = true;
        done();
      }
    );
    expect(error).toBe(false);
    expect(location.latitude).toBe(defaultLocation.latitude);
  });
});
