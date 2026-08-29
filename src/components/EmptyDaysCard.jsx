import { useMemo } from 'react';
import { formatDateKey, getMonthDays, getMonthLabel } from '../utils/dateUtils';

export default function EmptyDaysCard({ meclisler }) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const emptyDays = useMemo(() => {
    const bookedDates = new Set(meclisler.map((m) => m.tarix));
    const days = getMonthDays(now.getFullYear(), now.getMonth());
    return days
      .filter((d) => d && d >= today)
      .filter((d) => !bookedDates.has(formatDateKey(d)))
      .map((d) => d.getDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meclisler]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-medium">Boş günlər</p>
        <span className="text-xs text-gray-500">{getMonthLabel(now.getFullYear(), now.getMonth())}</span>
      </div>

      {emptyDays.length === 0 ? (
        <p className="text-sm text-gray-500">Bu ay bütün günlər üçün ən azı bir zal boşdur.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {emptyDays.map((day) => (
            <span
              key={day}
              className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-sm"
            >
              {day}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-600 mt-3">{emptyDays.length} gün heç bir zalda məclis yoxdur</p>
    </div>
  );
}
