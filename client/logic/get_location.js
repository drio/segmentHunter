const options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

export default function getLocation() {
  return new Promise((resolve, reject) => {
    const success = pos => resolve(pos.coords);
    const error = err => reject(`ERROR(${err.code}): ${err.message}`);
    navigator.geolocation.getCurrentPosition(success, error, options);
  });
}