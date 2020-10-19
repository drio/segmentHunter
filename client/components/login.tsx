import React from "react";
import Layout from "../components/layout";

const VERSION = process.env.version;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const OAUTH_URL = `http://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=read`;

function handleLogin() {
  const win = window.open(
    OAUTH_URL,
    "Strava Login",
    "width=800,height=600,modal=yes,alwaysRaised=yes"
  );

  const checkConnect = setInterval(function () {
    if (!win || !win.closed) return;
    clearInterval(checkConnect);
    window.location.reload();
  }, 100);
}

const Login = (): JSX.Element => {
  return (
    <Layout>
      <div className="center">
        <div className="title is-1 is-family-primary">Segment Hunter</div>
        <div className="title">
          <a href="#" onClick={handleLogin} className="button is-outlined">
            login
          </a>
        </div>
        <div>
          Made with ❤️ by{" "}
          <a href="https://drio.org">
            <span style={{ color: "tomato", fontWeight: "bold" }}>drio</span>
          </a>
        </div>
        <div style={{ fontSize: "10px", color: "gray" }}>v{VERSION}</div>
      </div>
    </Layout>
  );
};

export default Login;
