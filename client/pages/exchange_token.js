import React from "react";
import { useEffect } from "react";
import cookie from "js-cookie";
import Router from "next/router";

const STRAVA_URL = `https://www.strava.com/oauth/token`;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

const ExchangeToken = props => {
  const { access_token, username, profile } = props;

  useEffect(() => {
    if (access_token) {
      // FIXME: Is this secure?
      cookie.set("segment_hunter_access_token", access_token);
      cookie.set("segment_hunter_username", username);
      cookie.set("segment_hunter_profile", profile);
      window.close();
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
      const response = await fetch(STRAVA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: "authorization_code"
        })
      });
      if (response.status === 200) {
        const json = await response.json();
        return {
          access_token: json.access_token,
          username: json.athlete.username,
          profile: json.athlete.profile_medium
        };
      }
    } catch (error) {
      console.log("Error on oauth handshake: ", error);
    }
  }

  return {};
};

export default ExchangeToken;
