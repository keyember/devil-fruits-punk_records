import { useEffect, useState } from 'react';
import TerminalLayout from './components/TerminalLayout';
import { fetchDevilFruits, type DisplayDevilFruit } from './api/devil-fruits';

function App() {
  const [fruits, setFruits] = useState<DisplayDevilFruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDevilFruits()
      .then((data) => {
        if (!cancelled) setFruits(data);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : 'Erreur de chargement');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="p-6 font-mono text-green-400">Connexion à Punk Records…</div>;
  if (error) return <div className="p-6 font-mono text-red-400">Impossible de charger les fruits : {error}</div>;

  return <TerminalLayout fruits={fruits} />;
}

export default App;
