import { clearCookies } from "../logic/session";

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const OAUTH_URL = `http://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=read`;

function handleLoging() {
  const win = window.open(
    OAUTH_URL,
    "Strava Login",
    "width=800,height=600,modal=yes,alwaysRaised=yes"
  );

  const checkConnect = setInterval(function() {
    if (!win || !win.closed) return;
    clearInterval(checkConnect);
    window.location.reload();
  }, 100);
}

function handleLogout() {
  clearCookies();
  window.location.replace("/");
}

const LoggedInComp = ({ profile, username }) => {
  return (
    <>
      <li>
        <a href="#" onClick={handleLogout}>
          logout
        </a>{" "}
        <span>{username}</span>
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
          login
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
        {" "}
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
                  <LoggedInComp profile={profile} username={username} />
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
