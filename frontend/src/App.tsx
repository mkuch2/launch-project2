import { Outlet } from "react-router";
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <p>Logged in</p>}
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
