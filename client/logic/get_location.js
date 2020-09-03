const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

const LOCAL_KEY_COORDINATES = "segment_hunter_coordinates";

/*
  If we have a current location stored,
    return that
  otherwise:
    We try to get the current location using the browsers API.
    If that fails we try to use the stored location.
    If both fail, we raise an error.
 */
export default function getLocation() {
  return new Promise((resolve, reject) => {
    const storedCoordinates = JSON.parse(
      localStorage.getItem(LOCAL_KEY_COORDINATES)
    );

    if (
      storedCoordinates &&
      storedCoordinates.longitude &&
      storedCoordinates.latitude
    ) {
      resolve(storedCoordinates);
    } else {
      const success = pos => {
        console.log("Success getting current location.");
        localStorage.setItem(LOCAL_KEY_COORDINATES, JSON.stringify(pos.coords));
        resolve(pos.coords);
      };

      const error = err => {
        reject(`ERROR(${err.code}): ${err.message}`);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  });
}
