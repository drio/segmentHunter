import React from "react";
import { useEffect } from "react";
import Router from "next/Router";
import Layout from "../components/layout";

const STRAVA_URL = `https://www.strava.com/oauth/token`;
const CLIENT_SECRET = `XXXXXXXXXXXXXXXXXXXx`;

const ExchangeToken = props => {
  const { access_token, username, profile } = props;

  useEffect(() => {
    if (access_token) {
      // TODO: save the token in the cookie jar if not there
      Router.push("/");
    } else {
      Router.push("/error");
    }
  }, []);

  return null;
};

ExchangeToken.getInitialProps = async ({ query }) => {
  const { code, scope } = query;

  if (code && scope) {
    // TODO: check scope for read permissions
    try {
      /*
      const response = await fetch(STRAVA_URL, {
        body: JSON.stringify({
          client_id: 52300,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: "authorization_code"
        })
      });
      if (response.status === 200) {
        const { access_token, username, profile } = await response.json();
        return { access_token, username, profile };
      }
      */
      return { access_token: "XX", username: "drio", profile: "url here" };
    } catch (error) {
      console.log("Error on oauth handshake: ", error);
    }
  }

  return {};
};

export default ExchangeToken;
