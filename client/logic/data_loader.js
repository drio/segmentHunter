const STRAVA_API_URL = "https://www.strava.com/api/v3/segments";

async function stravaLoader(token, fetchFn = fetch) {
  const segmentDetailsList = [];
  let error = false;

  const fetchOpts = {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`
    }
  };

  const response = await fetchFn(`${STRAVA_API_URL}/starred`, fetchOpts);
  if (response.status === 200) {
    const listSegments = await response.json();
    for (let i = 0; i < listSegments.length; i++) {
      const response = await fetchFn(
        `${STRAVA_API_URL}/${listSegments[i].id}`,
        fetchOpts
      );
      if (response.status === 200) {
        const segDetails = await response.json();
        segmentDetailsList.push(segDetails);
      } else {
        error = `Couldn't load segment ${s.id}`;
      }
    }
  } else {
    error = `Couldn't load starred segments ${response.status}`;
  }

  return {
    error,
    segments: segmentDetailsList
  };
}

export { stravaLoader, STRAVA_API_URL };
