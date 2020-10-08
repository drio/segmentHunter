import Head from "next/head";
import React from "react";
import type { AppProps } from "next/app";
import "bulma/css/bulma.css";
import "../css/styles.css";
import "rc-slider/assets/index.css";
import store from "../logic/store/store";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { access_token } = pageProps;
  store.init(access_token);

  return (
    <div style={{ padding: 0 }}>
      <Head>
        <title>Strava Hunter by drio</title>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
          rel="stylesheet"
        />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-2124421-14"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-2124421-14');
          `,
          }}
        />
      </Head>
      <div>
        <Component {...pageProps} store={store} />
      </div>
    </div>
  );
}

export default MyApp;
