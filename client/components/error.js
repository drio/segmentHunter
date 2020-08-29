import Layout from "../components/layout";

const DefaultErrorDetail = () => {
  return (
    <div className="content has-text-left">
      Well, this is embarrassing. Something went wrong.
      <br />
      <br /> Please, head over to
      <a href="/contact"> contact </a> page and send us an email. We are here to
      help.
    </div>
  );
};

const CannotLoadLocation = () => {
  return (
    <div className="content has-text-left">
      Umm, it seems we are having problems getting your current location.
      <br />
      <br /> Please, head over to
      <a href="/contact"> contact </a> page and send us an email. We are here to
      help.
    </div>
  );
};

const StravaAccess = () => {
  return (
    <div className="content has-text-left">
      Umm, it seems we are having problems accessing your strava segments.
      <br />
      <br /> Please, head over to
      <a href="/contact"> contact </a> page and send us an email. We are here to
      help.
    </div>
  );
};

const WeatherAccess = () => {
  return (
    <div className="content has-text-left">
      Ups, we are having issues accessing the weather servers.
      <br />
      <br /> Please, head over to
      <a href="/contact"> contact </a> page and send us an email. We are here to
      help.
    </div>
  );
};

const NoWeatherData = () => {
  return (
    <div className="content has-text-left">
      Umm, there is no weather data. Bummer. <br /> <br />
      Please, head over to <a href="/contact"> contact </a> page and send us an
      email. We are here to help.
    </div>
  );
};

const NoSegmentData = () => {
  return (
    <div className="content has-text-left	">
      It seems you don't have any starred segments? <br /> <br />
      This could be happening because you haven't starred any segment in Strava
      yet. Segment Hunter uses only your starred segments. So, head over{" "}
      <a href="https://www.strava.com/">Strava</a> and star a few segments.
    </div>
  );
};

const ERROR_DETAILS = {
  default: DefaultErrorDetail,
  segments_access: StravaAccess,
  weather_access: WeatherAccess,
  location: CannotLoadLocation,
  no_segments: NoSegmentData,
  no_weather: NoWeatherData
};

const Error = ({ errorDetailKey }) => {
  const Details =
    Object.keys(ERROR_DETAILS).indexOf(errorDetailKey) > -1
      ? ERROR_DETAILS[errorDetailKey]
      : ERROR_DETAILS.default;
  return (
    <Layout>
      <div className="content">
        <div className="center">
          <div className="title is-3 is-family-primary">Strava Hunter</div>
          <div className="content" style={{ width: "600px" }}>
            <Details />
            <div className="content has-text-right">
              -- The Strava Hunter team.
            </div>
          </div>
          <div>
            <figure className="image">
              <img
                src="/404/dog-bike.jpg"
                alt="404"
                style={{ width: "600px" }}
              />
            </figure>
          </div>
          <br />
        </div>
      </div>
    </Layout>
  );
};

export default Error;
