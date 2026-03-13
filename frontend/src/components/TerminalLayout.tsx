import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DevilFruit {
  id: string;
  originalName: string;
  translatedName: string;
  type: "Paramecia" | "Logia" | "Zoan";
  description: string;
  ability: string;
  imageUrl?: string | null;
  rarity?: string;
  user?: string;
  bounty?: string;
}

const FILTER_TYPES = ["all", "Paramecia", "Logia", "Zoan"];

const TYPE_COLORS: Record<string, string> = {
  Paramecia: "text-cyan-400 border-cyan-400/40",
  Logia: "text-orange-400 border-orange-400/40",
  Zoan: "text-purple-400 border-purple-400/40",
};

const LOADING_LOGS = (fruitKey: string): string[] => [
  "> INITIALIZING PUNK RECORDS...",
  `> ACCESSING FRUIT DATA: [${fruitKey}]...`,
  "> CROSS-REFERENCING BUSTER CALL DATABASE...",
  "> ANALYZING LINEAGE FACTOR COMPOSITION...",
  "> DECODING LINEAGE FACTOR: 98%...",
  "> SYNTHESIS COMPLETE. RENDERING DATA...",
];

// ─── GlitchText ───────────────────────────────────────────────────────────────
function GlitchText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const [glitching, setGlitching] = useState(false);

  const trigger = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 400);
  };

  return (
    <span
      className={`relative inline-block cursor-pointer select-none ${className}`}
      onMouseEnter={trigger}
    >
      <span className={glitching ? "animate-glitch" : ""}>{children}</span>
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-400 opacity-60 translate-x-0.5 -translate-y-px overflow-hidden"
            style={{ clipPath: "inset(30% 0 50% 0)" }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-red-400 opacity-40 -translate-x-0.5 translate-y-px overflow-hidden"
            style={{ clipPath: "inset(60% 0 10% 0)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}

// ─── LoadingLogs ──────────────────────────────────────────────────────────────
function LoadingLogs({ fruitKey }: { fruitKey: string }) {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logs = LOADING_LOGS(fruitKey);
    const timers = logs.map((log, i) =>
      setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log]);
        setProgress(Math.round(((i + 1) / logs.length) * 100));
      }, i * 200),
    );
    return () => timers.forEach(clearTimeout);
  }, [fruitKey]);

  return (
    <div className="p-6 font-mono text-sm text-cyan-300 space-y-1">
      <AnimatePresence>
        {visibleLogs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-orange-400">[SYS] </span>
            {log}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="mt-4 h-1 bg-green-900/40 rounded overflow-hidden border border-green-500/20">
        <motion.div
          className="h-full bg-linear-to-r from-green-400 to-cyan-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// ─── FruitDetail ──────────────────────────────────────────────────────────────
function Section({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs text-green-500/50 tracking-widest mb-1.5 border-l-2 border-cyan-400/60 pl-2">
        {label}
      </p>
      <p
        className={`text-sm leading-relaxed tracking-wide ${muted ? "text-green-300/70" : "text-green-300/90"}`}
      >
        {value}
      </p>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-green-500/20 bg-black/30 p-3 rounded-sm">
      <p className="text-xs text-green-500/40 tracking-widest mb-1">{label}</p>
      <p className="text-green-300 text-sm tracking-wide">{value}</p>
    </div>
  );
}

function FruitDetail({ fruit }: { fruit: DevilFruit }) {
  const typeClass = TYPE_COLORS[fruit.type] ?? "text-green-400";

  return (
    <motion.div
      key={fruit.id}
      initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 font-mono"
    >
      {/* Header */}
      <div className="border-b border-green-500/20 pb-4 mb-5">
        <p className="text-xs text-green-500/50 tracking-widest mb-1">
          {fruit.id} // PUNK_RECORDS_DB // ENTRY VERIFIED
        </p>
        <h1
          className="text-3xl text-green-400 tracking-wider"
          style={{ textShadow: "0 0 10px rgba(74,222,128,0.6)" }}
        >
          {fruit.originalName}
        </h1>
        <p className="text-green-300/60 tracking-wide mt-1">
          {fruit.translatedName}
        </p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <span
            className={`px-3 py-0.5 text-xs border rounded-sm tracking-widest ${typeClass}`}
          >
            {fruit.type.toUpperCase()}
          </span>
          {fruit.rarity && (
            <span className="px-3 py-0.5 text-xs border rounded-sm tracking-widest border-yellow-500/40 text-yellow-400">
              {fruit.rarity}
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      {fruit.imageUrl && (
        <div className="flex justify-center mb-5">
          <div className="border border-green-500/20 bg-black/30 p-2 rounded-sm">
            <img
              src={fruit.imageUrl}
              alt={fruit.originalName}
              className="w-32 h-32 object-contain opacity-80"
              style={{ filter: "drop-shadow(0 0 8px rgba(74,222,128,0.4))" }}
            />
          </div>
        </div>
      )}

      {/* Contenu */}
      <Section label="DESCRIPTION" value={fruit.description} />
      <hr className="border-dashed border-green-500/15 my-4" />
      <Section label="CAPACITÉS / POUVOIRS" value={fruit.ability} muted />

      {/* Stats */}
      {(fruit.user || fruit.bounty) && (
        <>
          <hr className="border-dashed border-green-500/15 my-4" />
          <div className="grid grid-cols-2 gap-3">
            {fruit.user && (
              <StatBox label="UTILISATEUR CONNU" value={fruit.user} />
            )}
            {fruit.bounty && (
              <StatBox label="PRIME ENREGISTRÉE" value={fruit.bounty} />
            )}
          </div>
        </>
      )}

      <p className="mt-5 text-xs text-green-500/20 tracking-widest">
        ── ANALYSE TERMINÉE // VEGAPUNK EGGHEAD INSTITUTE // CLASSIFICATION:{" "}
        {fruit.type.toUpperCase()} ──
      </p>
    </motion.div>
  );
}

// ─── FilterButton ─────────────────────────────────────────────────────────────
function FilterButton({
  label,
  active,
  onClick,
  type,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  type: string;
}) {
  const activeStyles: Record<string, string> = {
    all: "border-green-400 text-green-400 bg-green-400/10",
    Paramecia: "border-cyan-400 text-cyan-400 bg-cyan-400/10",
    Logia: "border-orange-400 text-orange-400 bg-orange-400/10",
    Zoan: "border-purple-400 text-purple-400 bg-purple-400/10",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-0.5 text-xs border rounded-sm tracking-widest transition-all duration-150 ${active ? activeStyles[type] : "border-green-500/20 text-green-500/40 hover:border-green-400 hover:text-green-400"}`}
    >
      {label}
    </button>
  );
}

// ─── SidebarItem ──────────────────────────────────────────────────────────────
function SidebarItem({
  fruit,
  active,
  onClick,
}: {
  fruit: DevilFruit;
  active: boolean;
  onClick: () => void;
}) {
  const typeColor: Record<string, string> = {
    Paramecia: "text-cyan-400/70",
    Logia: "text-orange-400/70",
    Zoan: "text-purple-400/70",
  };

  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 border-b border-green-500/10 cursor-pointer transition-all duration-100 ${active ? "bg-green-500/10 border-l-2 border-l-green-400" : "hover:bg-green-500/5"}`}
    >
      <GlitchText
        className={`text-sm block truncate ${active ? "text-green-400" : "text-green-400/75"}`}
      >
        {fruit.originalName}
      </GlitchText>
      <p className={`text-xs tracking-widest mt-0.5 ${typeColor[fruit.type]}`}>
        {fruit.type?.toUpperCase()}
      </p>
    </div>
  );
}

// ─── TerminalLayout ───────────────────────────────────────────────────────────
export default function TerminalLayout({
  fruits = [],
}: {
  fruits: DevilFruit[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedFruit, setSelectedFruit] = useState<DevilFruit | null>(null);
  const [loadingFruit, setLoadingFruit] = useState<DevilFruit | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = fruits.filter((f) => {
    const matchType = activeFilter === "all" || f.type === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      f.originalName?.toLowerCase().includes(q) ||
      f.translatedName?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const handleSelectFruit = (fruit: DevilFruit) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedFruit(null);
    setLoadingFruit(fruit);
    timerRef.current = setTimeout(() => {
      setLoadingFruit(null);
      setSelectedFruit(fruit);
    }, 1400);
  };

  return (
    <div className="scanlines flex flex-col h-screen bg-[#050a0f] text-green-400 font-mono overflow-hidden border border-green-500/20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-green-500/20 bg-[#080f14] shrink-0">
        <div>
          <h1
            className="text-xl tracking-[4px]"
            style={{ textShadow: "0 0 8px rgba(74,222,128,0.7)" }}
          >
            ⬡ PUNK RECORDS DATABASE
          </h1>
          <p className="text-xs text-green-500/50 tracking-[2px]">
            DR. VEGAPUNK — LINEAGE FACTOR CLASSIFICATION SYSTEM
          </p>
        </div>
        <div className="text-xs text-cyan-400 tracking-wider">
          SYS:<span className="animate-pulse">█</span> ONLINE // v2.7.4
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-green-500/20 bg-[#080f14] shrink-0 flex-wrap">
        <span className="text-xs text-green-500/50 tracking-widest mr-2">
          CLASSIFICATION DU FACTEUR LIGNAGE ▸
        </span>
        {FILTER_TYPES.map((type) => (
          <FilterButton
            key={type}
            label={type === "all" ? "[ ALL ]" : type.toUpperCase()}
            active={activeFilter === type}
            onClick={() => setActiveFilter(type)}
            type={type}
          />
        ))}
      </div>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside className="w-56 border-r border-green-500/20 bg-[#080f14] flex flex-col shrink-0 overflow-hidden">
          <div className="px-3 py-2 border-b border-green-500/15">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="> RECHERCHER..."
              className="w-full bg-transparent border-b border-green-500/20 text-green-400 text-sm tracking-wide outline-none placeholder-green-500/30 pb-0.5 focus:border-green-400"
            />
          </div>
          <div className="px-3 py-1.5 text-xs text-green-500/40 tracking-widest border-b border-green-500/10 shrink-0">
            INDEX DES FRUITS [{filtered.length}]
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <p className="p-3 text-xs text-green-500/30 tracking-widest">
                AUCUN RÉSULTAT
              </p>
            )}
            {filtered.map((fruit) => (
              <SidebarItem
                key={fruit.id}
                fruit={fruit}
                active={
                  selectedFruit?.id === fruit.id ||
                  loadingFruit?.id === fruit.id
                }
                onClick={() => handleSelectFruit(fruit)}
              />
            ))}
          </div>
        </aside>

        {/* Data Panel */}
        <main className="flex-1 overflow-y-auto bg-[#050a0f]">
          <AnimatePresence mode="wait">
            {!selectedFruit && !loadingFruit && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-96 text-green-500/40 gap-3"
              >
                <div className="text-5xl opacity-30">◈</div>
                <p className="tracking-[4px] text-lg">
                  PUNK RECORDS INITIALISÉ
                </p>
                <p className="text-xs tracking-[3px]">
                  &gt; SÉLECTIONNER UN FRUIT POUR ANALYSER
                </p>
              </motion.div>
            )}
            {loadingFruit && (
              <motion.div
                key={`loading-${loadingFruit.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingLogs
                  key={loadingFruit.id}
                  fruitKey={loadingFruit.originalName
                    ?.replace(/\s/g, "_")
                    .toUpperCase()}
                />
              </motion.div>
            )}
            {selectedFruit && !loadingFruit && (
              <FruitDetail key={selectedFruit.id} fruit={selectedFruit} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
