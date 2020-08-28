import Layout from "../components/layout";

const default_msg = "Ups, something went wrong.";

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

const NoSegmentsDetail = () => {
  return (
    <div className="content has-text-left	">
      Do not panic. <br /> <br />
      This could be happening because you haven't starred any segment in Strava
      yet. Segment Hunter uses only your starred segments. So, head over{" "}
      <a href="https://www.strava.com/">Strava</a> and star a few segments.
      <br /> <br />
      Also, the app loads all yours starred segments from strava, it then
      divides them by local segments (local with respect to your current
      location) and global segments. If local segments are available, segment
      hunter will position the map in the local area and load the local
      segments. If local segments are not available, it will use your first
      starred segment and load that area in the map.
      <br /> <br />
      If you are using a VPN to connect to the Internet, Segment Hunter may pick
      a wrong location. If you experience issues, disable your VPN, reload the
      app and then start your VPN again.
    </div>
  );
};

const ERROR_DETAILS = {
  default: DefaultErrorDetail,
  segments: NoSegmentsDetail
};

const Error = ({ msg, errorDetailKey }) => {
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
