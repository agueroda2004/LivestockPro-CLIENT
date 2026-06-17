import { useSearchParams } from "react-router";
import FirstPanel from "../components/FirstPanel";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const [searchParams] = useSearchParams();
  const expired = searchParams.has("expired");

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <FirstPanel />
      <LoginForm expired={expired} />
    </main>
  );
}
