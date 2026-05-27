import "./styles/CreateForumForm.css";
import { X } from "lucide-react";

export default function CreateForumForm({
  forumName,
  setForumName,
  onSubmit,
  setCreatingForm,
}: {
  forumName: string;
  setForumName: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  setCreatingForm: (value: React.SetStateAction<boolean>) => void;
}) {
  return (
    <form className="create-forum-form" onSubmit={onSubmit}>
      <div className="create-forum-form__header">
        <h3 className="create-forum-form__title">Create a new forum</h3>
        <X
          style={{ cursor: "pointer" }}
          onClick={() => setCreatingForm(false)}
        />
      </div>
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
        disabled={!forumName.trim()}
      />
    </form>
  );
}
