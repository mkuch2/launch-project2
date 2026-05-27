import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Profile() {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <p>This is the profile page.</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
