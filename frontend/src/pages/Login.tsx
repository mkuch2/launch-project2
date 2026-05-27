import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import type { PrivateUser } from "../types";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }

    const bootstrapAuth = async () => {
      try {
        // Get spotify profile w/ access token
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/spotify/user-profile`,
          { withCredentials: true },
        );

        const profile: PrivateUser = {
          id: profileResponse.data.id,
          displayName: profileResponse.data.display_name,
        };

        let account: PrivateUser;

        try {
          const userResponse = await axios.get<PrivateUser>(
            `${import.meta.env.VITE_API_URL}/api/users/${profile.id}`,
          );
          account = userResponse.data;
        } catch (error: any) {
          if (error?.response?.status !== 404) {
            throw error;
          }

          // If profile ID not in Firebase, add it
          const createUserResponse = await axios.post<PrivateUser>(
            `${import.meta.env.VITE_API_URL}/api/users`,
            {
              userId: profile.id,
              username: profile.displayName,
            },
          );

          account = createUserResponse.data;
        }

        login(account);

        navigate("/");
      } catch (error) {
        console.error("Error bootstrapping login:", error);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapAuth();
  }, [login, navigate, user]);

  if (isBootstrapping) {
    return <p>Signing you in...</p>;
  }

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
