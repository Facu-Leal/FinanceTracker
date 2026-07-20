import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { dedupeCategories, seedIfEmpty } from './db/seed';
import { PrivacyModeProvider } from './shared/privacyMode';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty()
      .then(() => dedupeCategories())
      .then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <PrivacyModeProvider>
      <RouterProvider router={router} />
    </PrivacyModeProvider>
  );
}
