import { useMemo, useState } from 'react';
import { formatDateKey, getMonthDays, getMonthLabel, isToday, AZ_GUNLER } from '../utils/dateUtils';

const ZAL_RENGLERI = [
  'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500',
  'bg-sky-500', 'bg-fuchsia-500', 'bg-orange-500', 'bg-teal-500',
];

function zalRengi(zalId, zallar) {
  const index = zallar.findIndex((z) => z.id === zalId);
  return ZAL_RENGLERI[index % ZAL_RENGLERI.length] || 'bg-gray-500';
}

export default function Calendar({ zallar, meclisler }) {
  const [cursor, setCursor] = useState(new Date());
  const [selectedKey, setSelectedKey] = useState(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const meclislerByDay = useMemo(() => {
    const map = {};
    for (const m of meclisler) {
      if (!map[m.tarix]) map[m.tarix] = [];
      map[m.tarix].push(m);
    }
    return map;
  }, [meclisler]);

  const zalAdi = (zalId) => zallar.find((z) => z.id === zalId)?.ad || 'Silinmiş zal';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5"
        >
          ‹
        </button>
        <p className="text-white font-medium">{getMonthLabel(year, month)}</p>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
        {AZ_GUNLER.map((g) => (
          <div key={g}>{g}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = formatDateKey(date);
          const events = meclislerByDay[key] || [];
          const hasEvents = events.length > 0;
          const selected = key === selectedKey;

          return (
            <button
              key={key}
              onClick={() => setSelectedKey(selected ? null : key)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors
                ${hasEvents ? 'bg-indigo-500/15 text-white' : 'text-gray-400 hover:bg-white/5'}
                ${isToday(date) ? 'ring-1 ring-indigo-400' : ''}
                ${selected ? 'ring-2 ring-white' : ''}`}
            >
              <span>{date.getDate()}</span>
              {hasEvents && (
                <span className="flex gap-0.5">
                  {events.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={`w-1.5 h-1.5 rounded-full ${zalRengi(e.zalId, zallar)}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedKey && (
        <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
          <p className="text-sm text-gray-400 mb-2">{selectedKey} tarixindəki məclislər</p>
          {(meclislerByDay[selectedKey] || []).length === 0 && (
            <p className="text-sm text-gray-600">Bu tarixdə məclis yoxdur.</p>
          )}
          {(meclislerByDay[selectedKey] || []).map((m) => (
            <div key={m.id} className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{m.adFamiliya}</p>
                <p className="text-xs text-gray-500">
                  {zalAdi(m.zalId)} · {m.saat} · {m.qonaqSayi} qonaq
                </p>
              </div>
              <p className="text-sm text-emerald-400 font-medium">{m.cemi} ₼</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
