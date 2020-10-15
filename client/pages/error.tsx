import React from "react";
import { sessionLoader } from "../logic/session";
import Error from "../components/error";

function ErrorPage(): JSX.Element {
  return <Error />;
}

ErrorPage.getInitialProps = sessionLoader;
export default ErrorPage;
