import { Link } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import type { PublicUser } from "../../../types";

type ForumPreview = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
};

function Home() {
  const { user } = useContext(AuthContext) as { user: PublicUser | null };

  const [publicUser, setPublicUser] = useState<PublicUser | null>(null);
  const [forums, setForums] = useState<ForumPreview[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getHomeData() {
      if (!user?.id) return;

      try {
        setLoading(true);

        const [userResponse, forumsResponse, usersResponse] =
          await Promise.all([
            axios.get<PublicUser>(
              `${import.meta.env.VITE_API_URL}/api/users/${user.id}`
            ),
            axios.get<ForumPreview[]>(
              `${import.meta.env.VITE_API_URL}/api/forums`
            ),
            axios.get<PublicUser[]>(
              `${import.meta.env.VITE_API_URL}/api/users`
            ),
          ]);

        setPublicUser(userResponse.data);
        setForums(forumsResponse.data || []);

        const publicUsers = (usersResponse.data || []).filter(
          (person) => person.isPublic && person.id !== user.id
        );

        setUsers(publicUsers);
      } catch (err) {
        console.error("Could not load home data:", err);
      } finally {
        setLoading(false);
      }
    }

    getHomeData();
  }, [user?.id]);

  if (!user) {
    return (
      <main className="home-page">
        <section className="landing-hero">
          <div className="landing-content">
            <p className="home-kicker">WELCOME TO REVERB</p>

            <h1>Music sounds better together.</h1>

            <p className="home-subtitle">
              Reverb connects Spotify listeners through profiles, forums,
              discovery, and messaging.
            </p>

            <div className="home-actions">
              <Link to="/login" className="primary-button">
                Log in with Spotify
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const fullUser = publicUser || user;

  return (
    <main className="home-page">
      <section className="dashboard-hero">
        <div>
          <p className="home-kicker">YOUR REVERB</p>

          <h1>Welcome back, {fullUser.displayName}</h1>

          <p className="home-subtitle">
            See what people are talking about and discover listeners with public
            profiles.
          </p>

          <div className="home-actions">
            <Link to="/discover" className="primary-button">
              Discover Users
            </Link>

            <Link to="/forum" className="primary-button">
              Forums
            </Link>

            <Link to="/inbox" className="secondary-button">
              Inbox
            </Link>
          </div>
        </div>
      </section>

      {loading && <p className="loading-text">Loading your Reverb data...</p>}

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="home-kicker">COMMUNITY</p>
            <h2>Active Forums</h2>
          </div>

          <Link to="/forum" className="small-link">
            View all
          </Link>
        </div>

        {forums.length > 0 ? (
          <div className="text-card-grid">
            {forums.slice(0, 3).map((forum) => (
              <Link
                to={`/forum/${forum.id}`}
                className="text-card"
                key={forum.id}
              >
                <h3>{forum.name || forum.title || "Forum"}</h3>

                <p>{forum.description || "Join the discussion."}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No active forums yet. Visit Forums to start one.
          </div>
        )}
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="home-kicker">DISCOVER</p>
            <h2>People to Discover</h2>
          </div>

          <Link to="/discover" className="small-link">
            View all
          </Link>
        </div>

        {users.length > 0 ? (
          <div className="people-grid">
            {users.slice(0, 4).map((person) => (
              <Link
              to={`/profile/${person.id}`}
              className="person-card"
              key={person.id}
            >
              {person.profilePic ? (
                <img src={person.profilePic} alt={person.displayName} />
              ) : (
                <div className="person-avatar">
                  {person.displayName?.charAt(0).toUpperCase() || "R"}
                </div>
              )}

              <div className="person-card-content">
                <h3>{person.displayName}</h3>
                <p>View profile.</p>
              </div>
            </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No public users found yet. Check Discover later.
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;