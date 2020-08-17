import Head from "next/head";
import React from "react";
import "../css/styles.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Strava Hunter by drio</title>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/static/favicon.ico" rel="shortcut icon" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
