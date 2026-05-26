import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/spotify/user-profile`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      console.log("data is: ", data);
    };

    fetchProfile();
  }, []);

  return <p>This is the home page.</p>;
}
