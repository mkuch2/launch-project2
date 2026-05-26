export default function Login() {
  return (
    <>
      <h1>Welcome to Spotify Chat</h1>
      <h2>CLick 'Log In' to continue with Spotify</h2>
      <a href={`${import.meta.env.VITE_API_URL}/spotify/login`}>
        <button>Log in</button>
      </a>
    </>
  );
}
