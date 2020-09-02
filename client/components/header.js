import React from "react";
import { clearCookies } from "../logic/session";

function handleLogout() {
  clearCookies();
  window.location.replace("/");
}

const LoggedInComp = ({ profile, username }) => {
  return (
    <>
      <li>
        <a href="#" onClick={handleLogout} className="loginLink">
          logout
        </a>
        {/*<span> ({username})</span>*/}
      </li>
      <li style={{ marginLeft: "10px" }}>
        <figure className="image is-32x32">
          <img className="is-rounded" src={`${profile}`} />
        </figure>
      </li>
    </>
  );
};

const mainDivStyles = {
  margin: 0,
  background: "rgba(68, 65, 65, 0.8)",
  padding: "14px",
  color: "white",
  display: "inline-block",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 10,
  borderRadius: "0px 0px 5px 0px"
};

export default function Header({ props = {} }) {
  const { loading = true, access_token, username, profile, loggedIn } = props;

  if (!loggedIn) return null;

  return (
    <div style={mainDivStyles}>
      <header className="header has-text-weight-normal is-size-6">
        <div className="columns">
          <div
            className="column"
            style={{ padding: "5px", paddingLeft: "20px" }}
          >
            <ul
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              {loggedIn && !loading ? (
                <LoggedInComp profile={profile} username={username} />
              ) : null}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}
