import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="text-6xl">🤖❓</div>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-slate-500">Even the best models make mistakes. Let’s get you back on track.</p>
      <Link to="/" className="btn-primary mt-6">
        Go home
      </Link>
    </div>
  );
}
