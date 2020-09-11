import React from "react";
import Layout from "../components/layout";

interface ErrorProps {
  msg: string;
}
const Error = (props: ErrorProps): JSX.Element => {
  const msg = props.msg;
  return (
    <Layout>
      <div className="content">
        <div className="center">
          <div className="title is-3 is-family-primary">Strava Hunter</div>
          <div className="content" style={{ padding: "10px", width: "300px" }}>
            <div>Sorry, something went wrong.</div>
            <div>{msg}</div>
          </div>
          <div>
            <figure className="image">
              <img
                src="/404/dog-bike.jpg"
                alt="404"
                style={{ width: "300px" }}
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
