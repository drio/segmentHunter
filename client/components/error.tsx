import React from "react";
import Layout from "../components/layout";
import { StoreErrorContext } from "../logic/store/types";
import { genDetailedMsg } from "../logic/store/utils";

interface ErrorProps {
  error?: StoreErrorContext;
}

const Error = (props: ErrorProps): JSX.Element => {
  const error = props.error || null;
  const msg = genDetailedMsg(error);
  const { code = null, details = null } = error || {};

  if (details) {
    console.log(`ERROR: ${msg}, code: ${code}, details: ${details}`);
  }

  return (
    <Layout>
      <div className="content">
        <div className="center">
          <div className="title is-3 is-family-primary">Strava Hunter</div>
          <div className="content" style={{ padding: "10px", width: "300px" }}>
            <div>Ups, something went wrong.</div>
            <div>
              {msg} {code && `(code:${code})`}
            </div>
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
          <div>
            You can always clean your browser history and
            <a href="/">start over</a>.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Error;
