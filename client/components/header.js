//import Link from "next/link";
//import styles from "./header.module.css";
import { clearCookies } from "../logic/session";

function handleLoging() {
  console.log("loging");
}

function handleLogout() {
  clearCookies();
  window.location.replace("/");
}

const LoggedInComp = ({ profile }) => {
  return (
    <>
      <li>
        <a href="#" onClick={handleLogout}>
          logout
        </a>
      </li>
      <li style={{ marginLeft: "4px" }}>
        <figure className="image is-24x24">
          <img className="is-rounded" src={`${profile}`} />
        </figure>
      </li>
    </>
  );
};

const NotLoggedIn = () => {
  return (
    <>
      <li>
        <a href="#" onClick={handleLoging}>
          logout
        </a>
      </li>
    </>
  );
};

export default function Header({ props = {} }) {
  const { loading = true, access_token, username, profile, loggedIn } = props;
  return (
    <div>
      <div
        className="has-text-weight-medium is-size-7"
        style={{ position: "absolute", top: "7px", right: "20px" }}
      >
        Segment Hunter (v0.2.2)
      </div>
      <header className="header has-text-weight-medium is-size-7">
        <div style={{ backgroundColor: "white" }}>
          <div className="columns">
            <div
              className="column"
              style={{ padding: "18px", paddingLeft: "40px" }}
            >
              <ul
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {loggedIn && !loading ? (
                  <LoggedInComp profile={profile} />
                ) : (
                  <NotLoggedIn />
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
