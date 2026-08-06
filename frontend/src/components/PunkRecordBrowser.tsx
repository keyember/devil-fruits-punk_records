import { useEffect, useState } from 'react';
import { fetchDevilFruitPage, type DisplayDevilFruit } from '../api/devil-fruits';

const types = ['all', 'Paramecia', 'Logia', 'Zoan', 'Smile', 'Clone'];
const fallbackImage = '/favicon.svg';

export default function PunkRecordBrowser() {
  const [fruits, setFruits] = useState<DisplayDevilFruit[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setPage(1), [search, type]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDevilFruitPage(page, 24, { search, type })
      .then((result) => {
        if (cancelled) return;
        setFruits(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, search, type]);

  return (
    <main className="min-h-screen bg-[#050a0f] p-4 font-mono text-green-400">
      <header className="mb-4 border-b border-green-500/20 pb-3">
        <h1 className="text-xl tracking-[4px]">⬡ PUNK RECORDS DATABASE</h1>
        <p className="text-xs text-green-500/50">DEVIL FRUIT INDEX // {total} ENTRIES</p>
      </header>
      <section className="mb-4 flex flex-wrap gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="> RECHERCHER..." className="min-w-64 flex-1 border-b border-green-500/30 bg-transparent px-2 py-1 outline-none placeholder-green-500/30" />
        {types.map((item) => <button key={item} type="button" onClick={() => setType(item)} className={`border px-2 py-1 text-xs ${type === item ? 'border-green-300 text-green-300' : 'border-green-500/20 text-green-500/50'}`}>{item.toUpperCase()}</button>)}
      </section>
      {error && <p className="mb-3 text-red-400">{error}</p>}
      {loading && <p className="mb-3 text-cyan-400">SYNCHRONISATION…</p>}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fruits.map((fruit) => <article key={fruit.id} className="border border-green-500/20 bg-[#080f14] p-3">
          <img src={fruit.imageUrl || fallbackImage} alt={fruit.originalName} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="mb-3 h-32 w-full object-contain" />
          <h2 className="text-green-300">{fruit.originalName}</h2>
          <p className="text-xs text-cyan-400">{fruit.type}</p>
          <p className="mt-2 line-clamp-4 text-sm text-green-300/70">{fruit.description}</p>
        </article>)}
      </section>
      {!loading && fruits.length === 0 && <p className="py-12 text-center text-green-500/50">AUCUN RÉSULTAT</p>}
      <nav className="mt-5 flex items-center justify-center gap-3 text-xs" aria-label="Pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="border border-green-500/30 px-3 py-2 disabled:opacity-30">← PRÉCÉDENTE</button>
        <span>PAGE {page} / {totalPages}</span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="border border-green-500/30 px-3 py-2 disabled:opacity-30">SUIVANTE →</button>
      </nav>
    </main>
  );
}
