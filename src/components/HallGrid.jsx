import { useState } from 'react';
import { addZal } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function HallGrid({ zallar, meclisler }) {
  const { customerId } = useAuth();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function upcomingCount(zalId) {
    return meclisler.filter((m) => {
      const d = new Date(m.tarix);
      return m.zalId === zalId && d >= today;
    }).length;
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    await addZal(customerId, newName.trim());
    setNewName('');
    setAdding(false);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {zallar.map((zal) => (
        <div
          key={zal.id}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4"
        >
          <p className="text-white font-medium truncate">{zal.ad}</p>
          <p className="text-xs text-gray-500 mt-1">
            {upcomingCount(zal.id)} yaxın gələcək məclis
          </p>
        </div>
      ))}

      {adding ? (
        <div className="rounded-xl border border-indigo-400/40 bg-white/5 p-4 flex flex-col gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Zal adı"
            className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white text-xs py-1.5"
            >
              Əlavə et
            </button>
            <button
              onClick={() => setAdding(false)}
              className="rounded-md border border-white/10 text-gray-400 text-xs px-2"
            >
              Ləğv et
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-xl border border-dashed border-white/15 hover:border-indigo-400/50 hover:bg-white/5 transition-colors p-4 flex items-center justify-center text-gray-500 hover:text-gray-300 text-sm"
        >
          + Yeni zal
        </button>
      )}
    </div>
  );
}
