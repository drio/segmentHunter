import Layout from "../components/layout";

const Error = ({ msg }) => {
  return (
    <Layout>
      <div className="content"></div>
      <div className="center">
        <div className="title is-2 is-family-primary">Strava Hunter</div>
        <div>
          <figure className="image">
            <img src="/404/dog-bike.jpg" alt="404" style={{ width: "800px" }} />
          </figure>
        </div>
        <br />
        <div className="content">
          <div className="title is-5">Sorry, something went wrong.</div>
        </div>
      </div>
    </Layout>
  );
};

export default Error;
