import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import type { PrivateUser } from "../../../types";

export default function LoginCallback() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
    const bootstrapAuth = async () => {
      try {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/spotify/user-profile`,
          { withCredentials: true },
        );
        

        const profile: PrivateUser = {
          id: profileResponse.data.id,
          displayName: profileResponse.data.display_name,
          profilePic: profileResponse.data.images?.[0]?.url || "",
        };

        let account: PrivateUser;

        try {
          const userResponse = await axios.get<PrivateUser>(
            `${import.meta.env.VITE_API_URL}/api/users/${profile.id}`,
          );
          account = userResponse.data as PrivateUser;
        } catch (error:unknown) {
          if (axios.isAxiosError(error) &&error?.response?.status !== 404) {
            throw error;
          }

          const createUserResponse = await axios.post<PrivateUser>(
            `${import.meta.env.VITE_API_URL}/api/users`,
            {
              userId: profile.id,
              displayName: profile.displayName,
              images: profileResponse.data.images,
            },
          );

          account = createUserResponse.data;
        }

        login(account);
        navigate("/");
      } catch (error:unknown) {
        if (axios.isAxiosError(error) && error?.response?.status === 400) {
          console.error("Error bootstrapping login:", error);
        }
      }
    };

    bootstrapAuth();
  }, [login, navigate, user]);

  return (
    <>
      <p>Signing you in...</p>
    </>
  );
}
