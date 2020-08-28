import { useRouter } from "next/router";
import Error from "../../components/error";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;
  return <Error msg={"msg here"} errorDetailKey={error} />;
}
