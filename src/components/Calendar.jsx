import { useMemo, useState } from 'react';
import { formatDateKey, getMonthDays, getMonthLabel, isToday, AZ_GUNLER } from '../utils/dateUtils';
import { getZalColor, hexToRgba } from '../utils/colors';
import MeclisDetailModal from './MeclisDetailModal';

export default function Calendar({ zallar, meclisler, bgImage }) {
  const [cursor, setCursor] = useState(new Date());
  const [selectedKey, setSelectedKey] = useState(null);
  const [detailMeclis, setDetailMeclis] = useState(null);

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
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 overflow-hidden">
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="pointer-events-none select-none absolute -right-4 -bottom-4 h-[125%] w-auto object-contain opacity-30 mix-blend-screen"
        />
      )}

      <div className="relative z-10">
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
          const uniqueZalIds = [...new Set(events.map((e) => e.zalId))];
          const isSplit = uniqueZalIds.length >= 2;
          const dayBg = !hasEvents
            ? undefined
            : isSplit
            ? {
                backgroundImage: `linear-gradient(135deg, ${hexToRgba(getZalColor(uniqueZalIds[0], zallar).hex, 0.65)} 50%, ${hexToRgba(getZalColor(uniqueZalIds[1], zallar).hex, 0.65)} 50%)`,
              }
            : { backgroundColor: hexToRgba(getZalColor(uniqueZalIds[0], zallar).hex, 0.55) };

          return (
            <button
              key={key}
              onClick={() => setSelectedKey(selected ? null : key)}
              style={dayBg}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors
                ${hasEvents ? 'text-white font-semibold' : 'text-gray-400 hover:bg-white/5'}
                ${isToday(date) ? 'ring-1 ring-indigo-400' : ''}
                ${selected ? 'ring-2 ring-white' : ''}`}
            >
              <span>{date.getDate()}</span>
              {hasEvents && (
                <span className="flex gap-0.5">
                  {events.slice(0, 3).map((e) => (
                    <span key={e.id} className={`w-1.5 h-1.5 rounded-full ${getZalColor(e.zalId, zallar).dot}`} />
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
          {(meclislerByDay[selectedKey] || []).map((m) => {
            const color = getZalColor(m.zalId, zallar);
            return (
              <button
                key={m.id}
                onClick={() => setDetailMeclis(m)}
                className={`w-full text-left rounded-lg bg-white/5 border ${color.border} hover:bg-white/10 transition-colors p-3 flex items-center justify-between`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{m.adFamiliya}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {zalAdi(m.zalId)} · {m.saat} · {m.qonaqSayi} qonaq
                    </p>
                  </div>
                </div>
                <p className="text-sm text-emerald-400 font-medium shrink-0 ml-2">{m.cemi} ₼</p>
              </button>
            );
          })}
        </div>
      )}

      {detailMeclis && (
        <MeclisDetailModal
          meclis={detailMeclis}
          zalAdi={zalAdi(detailMeclis.zalId)}
          onClose={() => setDetailMeclis(null)}
        />
      )}
      </div>
    </div>
  );
}
