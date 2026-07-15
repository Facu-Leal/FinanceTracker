import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { dedupeCategories, seedIfEmpty } from './db/seed';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty()
      .then(() => dedupeCategories())
      .then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <RouterProvider router={router} />;
}
