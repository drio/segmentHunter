import { stravaLoader, STRAVA_API_URL } from "./data_loader";

import segments from "./test_data/segments/all.json";
import starred from "./test_data/segments/starred.json";

const re_url_id = new RegExp(`${STRAVA_API_URL}/(\\d+)`);
const re_starred = new RegExp(`${STRAVA_API_URL}/starred`);

const mockFetch = jest.fn(url => {
  if (url.match(re_starred)) {
    return {
      status: 200,
      json: async () => starred
    };
  }

  const match = url.match(re_url_id);
  if (match) {
    const id = +match[1];
    return {
      status: 200,
      json: async () => segments.filter(s => +s.id === id)[0]
    };
  }

  return {
    status: 404
  };
});

test("We load segment data correctly", async () => {
  const r = await stravaLoader("token_here", mockFetch);
  const { segments } = r;
  expect(segments.length).toBe(30);
  expect(segments[0].id).toBeGreaterThan(0);
  expect(segments[0].name.length).toBeGreaterThan(0);
});
