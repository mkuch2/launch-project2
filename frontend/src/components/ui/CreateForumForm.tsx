import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import "./styles/CreateForumForm.css";

export default function CreateForumForm() {
  const { user } = useContext(AuthContext);

  const [forumName, setForumName] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      throw new Error("User must be logged in to create a new forum.");
    }

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
    <form className="create-forum-form" onSubmit={handleSubmit}>
      <h3 className="create-forum-form__title">Create a new forum</h3>
      <label className="create-forum-form__label" htmlFor="forum-name">
        Forum name
      </label>
      <input
        className="create-forum-form__input"
        type="text"
        id="forum-name"
        name="forum-name"
        value={forumName}
        placeholder="e.g. Favorite Albums of 2026"
        onChange={(e) => setForumName(e.target.value)}
      ></input>
      <input
        className="create-forum-form__submit"
        type="submit"
        value="Create forum"
      />
    </form>
  );
}
