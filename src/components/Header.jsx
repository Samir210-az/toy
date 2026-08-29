import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header({ onAddClick }) {
  const { customer, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1115]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-white font-semibold truncate">{customer?.restoranAdi}</h1>
          <p className="text-xs text-gray-500">Toy/Məclis idarəetməsi</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/anbar"
            className="rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-300"
          >
            📦 Anbar
          </Link>
          <Link
            to="/kadr"
            className="rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-300"
          >
            👥 Kadr
          </Link>
          <button
            onClick={onAddClick}
            className="rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors px-4 py-2 text-sm font-medium text-white"
          >
            + Toy/Məclis əlavə et
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-3 py-2 text-sm text-gray-400"
          >
            Çıxış
          </button>
        </div>
      </div>
    </header>
  );
}
