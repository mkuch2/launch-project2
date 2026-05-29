import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../AuthContext";
import type { PublicUser } from "../../../types";
import UserCard from "../components/UserCard";
import "./styles/Discover.css";

type DiscoverUser = PublicUser & {
  isPublic?: boolean;
  showTopSongs?: boolean;
  showTopArtists?: boolean;
  showLikedSongs?: boolean;
};

export default function Discover() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:5005/api/users", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: DiscoverUser[] = await response.json();

        const publicUsers = data.filter((user) => user.isPublic !== false);

        setUsers(publicUsers);
      } catch (err) {
        setError("Could not load users. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.displayName ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="discover">
      <div className="discover__header">
        <h1>Discover</h1>

        <input
          className="discover__search"
          type="text"
          placeholder="Browse public users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="discover__list">
        {isLoading && <p className="discover__status">Loading...</p>}

        {error && (
          <p className="discover__status discover__status--error">{error}</p>
        )}

        {!isLoading && !error && filteredUsers.length === 0 && (
          <p className="discover__status">No public users found.</p>
        )}

        {!isLoading &&
          !error &&
          filteredUsers.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  );
}