import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";

export default function CreateForumForm() {
  const { user } = useContext(AuthContext);

  const [forumName, setForumName] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forums`, {
        author: { id: user?.id, displayName: user?.displayName },
        name: forumName,
      });
    } catch (err) {
      console.error("Error posting forum: ", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="forum-name" />
      <input
        type="text"
        name="forum-name"
        value={forumName}
        onChange={(e) => setForumName(e.target.value)}
      ></input>
      <input type="submit" />
    </form>
  );
}
