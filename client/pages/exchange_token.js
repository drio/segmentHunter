import React from "react";
import { useState } from "react";
import Router from "next/Router";
import Layout from "../components/layout";

const STRAVA_URL = `https://www.strava.com/oauth/token`;

const ExchangeToken = ({ access_token, username, profile }) => {
  useEffect(() => {
    if (access_token) {
      // TODO: save the token in the cookie jar if not there
      Router.push("/");
    }
  }, []);

  return (
    <Layout>
      <div>Something went wrong</div>
    </Layout>
  );
};

ExchangeToken.getInitialProps = async ({ query }) => {
  const { code, scope } = query;

  if (scope) {
    // TODO: check scope for read permissions
    try {
      const response = await fetch(STRAVA_URL, {
        body: JSON.stringify({
          client_id: 52300,
          client_secret: "-------FIXME---",
          code,
          grant_type: "authorization_code"
        })
      });
      if (response.status === 200) {
        const { access_token, username, profile } = await response.json();
        return { access_token, username, profile };
      }
    } catch (error) {
      console.log("Error on oauth handshake: ", error);
    }
  }

  return {};
};

export default ExchangeToken;
