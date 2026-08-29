import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header({ onAddClick }) {
  const { customer, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1115]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-white font-semibold truncate">{customer?.restoranAdi}</h1>
          <p className="text-xs text-gray-500">Toy/Məclis idarəetməsi</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAddClick}
            className="rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors px-3 py-2 text-sm font-medium text-white whitespace-nowrap"
          >
            + Məclis əlavə et
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-400 whitespace-nowrap"
          >
            Çıxış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-3 flex items-center gap-2 overflow-x-auto">
        <Link
          to="/anbar"
          className="shrink-0 rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-300"
        >
          📦 Anbar
        </Link>
        <Link
          to="/kadr"
          className="shrink-0 rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-300"
        >
          👥 Kadr
        </Link>
        <Link
          to="/xerc"
          className="shrink-0 rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-300"
        >
          💰 Xərc
        </Link>
      </div>
    </header>
  );
}
