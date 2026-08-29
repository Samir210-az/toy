import { useMemo } from 'react';
import { getZalColor } from '../utils/colors';

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const AZ_AYLAR = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

export default function RevenueCard({ zallar, meclisler }) {
  const stats = useMemo(() => {
    const monthKey = currentMonthKey();
    let monthTotal = 0;
    let monthCount = 0;
    let allTimeTotal = 0;
    const perHall = {};

    for (const m of meclisler) {
      const cemi = Number(m.cemi) || 0;
      allTimeTotal += cemi;
      perHall[m.zalId] = (perHall[m.zalId] || 0) + cemi;
      if (m.tarix?.startsWith(monthKey)) {
        monthTotal += cemi;
        monthCount += 1;
      }
    }

    const perHallList = zallar
      .map((z) => ({ zal: z, total: perHall[z.id] || 0 }))
      .sort((a, b) => b.total - a.total);

    return { monthTotal, monthCount, allTimeTotal, perHallList };
  }, [zallar, meclisler]);

  const monthLabel = AZ_AYLAR[new Date().getMonth()];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-white/0 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-medium">Gəlir</p>
        <span className="text-xs text-gray-500">{monthLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Bu ay ({stats.monthCount} məclis)</p>
          <p className="text-2xl font-semibold text-emerald-400">
            {stats.monthTotal.toLocaleString('az-AZ')} ₼
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Bütün dövr</p>
          <p className="text-2xl font-semibold text-white">
            {stats.allTimeTotal.toLocaleString('az-AZ')} ₼
          </p>
        </div>
      </div>

      {stats.perHallList.length > 0 && (
        <div className="border-t border-white/10 pt-3 space-y-2">
          {stats.perHallList.map(({ zal, total }) => {
            const color = getZalColor(zal.id, zallar);
            const pct = stats.allTimeTotal > 0 ? Math.round((total / stats.allTimeTotal) * 100) : 0;
            return (
              <div key={zal.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
                <span className="text-sm text-gray-300 truncate flex-1">{zal.ad}</span>
                <span className="text-sm text-white font-medium shrink-0">
                  {total.toLocaleString('az-AZ')} ₼
                </span>
                <span className="text-xs text-gray-500 w-9 text-right shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
