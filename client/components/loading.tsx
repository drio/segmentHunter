import React from "react";
import Layout from "../components/layout";

const Loading = () => {
  return (
    <Layout>
      <div className="content"></div>
      <div className="center">
        <div className="title is-3 is-family-primary">Segment Hunter</div>

        <div className="content">
          <div className="is-5">Loading ...</div>
        </div>

        <div>
          <figure className="image">
            <img src="loading/loading.gif" alt="Image" />
          </figure>
        </div>
        <br />
      </div>
    </Layout>
  );
};

export default Loading;
