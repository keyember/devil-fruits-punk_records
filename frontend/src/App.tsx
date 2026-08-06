import { useEffect, useState } from 'react';
import TerminalLayout from './components/TerminalLayout';
import PaginationBar from './components/PaginationBar';
import { fetchDevilFruitPage, type DisplayDevilFruit } from './api/devil-fruits';

function App() {
  const [fruits, setFruits] = useState<DisplayDevilFruit[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDevilFruitPage(page)
      .then((result) => {
        if (cancelled) return;
        setFruits(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  if (loading && fruits.length === 0) return <div className="p-6 font-mono text-green-400">Connexion à Punk Records…</div>;
  if (error && fruits.length === 0) return <div className="p-6 font-mono text-red-400">Impossible de charger les fruits : {error}</div>;

  return (
    <>
      <TerminalLayout fruits={fruits} />
      <PaginationBar page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
      {loading && <div className="fixed right-3 top-3 z-20 font-mono text-xs text-cyan-400">SYNCHRONISATION…</div>}
      {error && <div className="fixed right-3 top-3 z-20 font-mono text-xs text-red-400">{error}</div>}
    </>
  );
}

export default App;
