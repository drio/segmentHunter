import Layout from "../components/layout";

const Loading = () => {
  return (
    <Layout>
      <div className="center">
        <div>
          <figure className="image">
            <img src="loading/loading.gif" alt="Image" />
          </figure>
        </div>
        <br />
        <div className="content">
          <div className="title is-4">Loading data ...</div>
        </div>
      </div>
    </Layout>
  );
};

export default Loading;
