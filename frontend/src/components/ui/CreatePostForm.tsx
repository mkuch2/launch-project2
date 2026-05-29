import { X } from "lucide-react";
import "./styles/CreatePostForm.css";

export default function CreatePostForm({
  postTitle,
  setPostTitle,
  postContent,
  setPostContent,
  onSubmit,
  setCreatingForm,
}: {
  postTitle: string;
  setPostTitle: (value: string) => void;
  postContent: string;
  setPostContent: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  setCreatingForm: (value: React.SetStateAction<boolean>) => void;
}) {
  return (
    <form className="create-post-form" onSubmit={onSubmit}>
      <div className="create-post-form__header">
        <h3 className="create-post-form__title">Create a new post</h3>
        <X
          style={{ cursor: "pointer" }}
          onClick={() => setCreatingForm(false)}
        />
      </div>

      <label className="create-post-form__label" htmlFor="post-title">
        Post title
      </label>
      <input
        className="create-post-form__input"
        type="text"
        id="post-title"
        name="post-title"
        value={postTitle}
        placeholder="e.g. Best albums of the decade"
        onChange={(e) => setPostTitle(e.target.value)}
      />

      <label className="create-post-form__label" htmlFor="post-content">
        Post content
      </label>
      <textarea
        className="create-post-form__textarea"
        id="post-content"
        name="post-content"
        value={postContent}
        placeholder="Share your thoughts..."
        onChange={(e) => setPostContent(e.target.value)}
        rows={5}
      />

      <input
        className="create-post-form__submit"
        type="submit"
        value="Create post"
        disabled={!postTitle.trim() || !postContent.trim()}
      />
    </form>
  );
}
