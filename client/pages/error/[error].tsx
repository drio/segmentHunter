import React from "react";
import { useRouter } from "next/router";
import Error from "../../components/error";

export default function ErrorPage(): JSX.Element {
  const router = useRouter();
  const { error } = router.query;
  return <Error errorDetailKey={error} />;
}
