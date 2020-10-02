import nextCookie from "next-cookies";
import { NextPageContext } from "next";
import cookie from "js-cookie";

interface SessionData {
  loggedIn: boolean;
  access_token: string | null;
  username: string | null;
  profile: string | null;
}

const APP_NAME = "segment_hunter";
const COOKIES = ["access_token", "profile", "user_name"].map(
  (e) => `${APP_NAME}_${e}`
);

const sessionLoader = async (ctx: NextPageContext): Promise<SessionData> => {
  const cookies = nextCookie(ctx);
  const loggedIn = cookies.segment_hunter_access_token ? true : false;
  return {
    loggedIn,
    access_token: cookies.segment_hunter_access_token || null,
    username: cookies.segment_hunter_username || null,
    profile: cookies.segment_hunter_profile || null,
  };
};

function clearCookies(): void {
  COOKIES.forEach((c) => cookie.remove(c));
}

export { sessionLoader, clearCookies };
