import { Link } from 'react-router-dom';
import { CompassIcon } from '../components/Icons.jsx';

export default function NotFoundPage() {
  return (
    <div className="surface mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
        <CompassIcon className="h-6 w-6" />
      </span>
      <p className="eyebrow">Off the map</p>
      <h1 className="font-display text-3xl font-semibold">This page is not in the log</h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        The address you followed does not exist in the archive. Return to the overview and pick a
        route from there.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Back to the overview
      </Link>
    </div>
  );
}
