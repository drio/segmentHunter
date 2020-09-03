const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

const LOCAL_KEY_COORDINATES = "segment_hunter_coordinates";

function storeLocation({ latitude, longitude }) {
  if ((latitude, longitude)) {
    console.log("Saving coordinates in local storage");
    localStorage.setItem(
      LOCAL_KEY_COORDINATES,
      JSON.stringify({ latitude, longitude })
    );
  }
}

/*
  If we have a current location stored,
    return that
  otherwise:
    We try to get the current location using the browsers API.
    If that fails we try to use the stored location.
    If both fail, we raise an error.
 */
function getLocation() {
  return new Promise((resolve, reject) => {
    const storedCoordinates = JSON.parse(
      localStorage.getItem(LOCAL_KEY_COORDINATES)
    );

    if (
      storedCoordinates &&
      storedCoordinates.longitude &&
      storedCoordinates.latitude
    ) {
      console.log("Using previously stored location");
      resolve(storedCoordinates);
    } else {
      const success = pos => {
        const { latitude, longitude } = pos.coords;
        storeLocation({ latitude, longitude });
        resolve({ latitude, longitude });
      };

      const error = err => {
        reject(`ERROR(${err.code}): ${err.message}`);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  });
}

export { getLocation, storeLocation };
