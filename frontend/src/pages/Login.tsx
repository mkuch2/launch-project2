import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  return (
    <>
      <h1>Welcome to Spotify Chat</h1>
      <h2>Click Log In to continue with Spotify</h2>
      <a href={`${import.meta.env.VITE_API_URL}/spotify/login`}>
        <button type="button">Log in</button>
      </a>
    </>
  );
}
