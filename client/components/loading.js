import Layout from "../components/layout";

const Loading = () => {
  return (
    <Layout>
      <div className="content"></div>
      <div className="center">
        <div className="title is-2 is-family-primary">Strava Hunter</div>
        <div>
          <figure className="image">
            <img src="loading/loading.gif" alt="Image" />
          </figure>
        </div>
        <br />
        <div className="content">
          <div className="is-5">Loading data ...</div>
        </div>
      </div>
    </Layout>
  );
};

export default Loading;
