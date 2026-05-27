import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import LikedSongs from "./pages/LikedSongs.tsx";
import TopArtists from "./pages/TopArtists.tsx";
import TopSongs from "./pages/TopSongs.tsx";
import Discover from "./pages/Discover.tsx";
import Forum from "./pages/Forum.tsx";
import Inbox from "./pages/Inbox.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login.tsx";
import { AuthProvider } from "./AuthContext.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import AuthAxiosProvider from "./components/AuthAxiosProvider.tsx";
import LoginCallback from "./pages/LoginCallback.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login-callback",
    element: <LoginCallback />,
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "profile/:userId",
            element: <Profile />,
          },
          {
            path: "liked-songs",
            element: <LikedSongs />,
          },
          {
            path: "top-artists",
            element: <TopArtists />,
          },
          {
            path: "top-songs",
            element: <TopSongs />,
          },
          {
            path: "discover",
            element: <Discover />,
          },
          {
            path: "forum",
            element: <Forum />,
          },
          {
            path: "inbox",
            element: <Inbox />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AuthAxiosProvider>
        <RouterProvider router={router} />
      </AuthAxiosProvider>
    </AuthProvider>
  </StrictMode>,
);
