import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-sm text-zinc-400">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="rounded-xl bg-blue-600 px-5 py-2 text-sm">
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
