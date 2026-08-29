import { useEffect, useState } from 'react';
import { ADMIN_PIN, activatePlan, setCustomerStatus, subscribeAllCustomers } from '../utils/db';

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('az-AZ');
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (!authed) return;
    return subscribeAllCustomers(setCustomers);
  }, [authed]);

  function handlePinSubmit(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setError('');
    } else {
      setError('PIN yanlışdır.');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115] px-4">
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
          <input
            autoFocus
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Admin PIN"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 text-center"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 py-2.5 text-white font-medium">
            Daxil ol
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-white text-xl font-semibold mb-4">Müştərilər</h1>

        {customers.length === 0 && <p className="text-gray-500">Hələ qeydiyyat yoxdur.</p>}

        {customers.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-white font-medium">{c.restoranAdi}</p>
                <p className="text-xs text-gray-500">{c.phone}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  c.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : c.status === 'trial'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {c.status === 'active' ? 'Aktiv' : c.status === 'trial' ? 'Trial' : 'Bitib'}
              </span>
            </div>

            <div className="text-xs text-gray-500 mb-3 space-x-4">
              <span>Trial bitmə: {formatDate(c.trialEndsAt)}</span>
              <span>Plan: {c.planType || '—'}</span>
              <span>Plan bitmə: {formatDate(c.planExpiresAt)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => activatePlan(c.id, '1ay')}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              >
                1 aylıq aktivləşdir
              </button>
              <button
                onClick={() => activatePlan(c.id, '6ay')}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              >
                6 aylıq aktivləşdir
              </button>
              <button
                onClick={() => activatePlan(c.id, '1il')}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              >
                1 illik aktivləşdir
              </button>
              <button
                onClick={() => setCustomerStatus(c.id, 'expired')}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                Bloklaşdır
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
