type PaginationBarProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function PaginationBar({ page, totalPages, total, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="fixed bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 border border-green-500/30 bg-[#080f14]/95 px-3 py-2 font-mono text-xs text-green-400 shadow-lg" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="border border-green-500/30 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-30 hover:border-green-400"
      >
        ← PRÉCÉDENTE
      </button>
      <span className="tracking-widest">PAGE {page} / {totalPages} · {total} FRUITS</span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="border border-green-500/30 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-30 hover:border-green-400"
      >
        SUIVANTE →
      </button>
    </nav>
  );
}
