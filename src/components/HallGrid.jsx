import { Link } from 'react-router-dom';
import { getZalColor } from '../utils/colors';
import { getHallImage } from '../utils/hallImages';
import { formatDateKey } from '../utils/dateUtils';

const DOLU_RENGI = {
  border: 'border-emerald-400/60',
  soft: 'bg-emerald-500/25',
  dot: 'bg-emerald-500',
  text: 'text-emerald-300',
};

export default function HallGrid({ zallar, meclisler }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);

  function upcomingCount(zalId) {
    return meclisler.filter((m) => {
      const d = new Date(m.tarix);
      return m.zalId === zalId && d >= today;
    }).length;
  }

  function isDoluBugun(zalId) {
    return meclisler.some((m) => m.zalId === zalId && m.tarix === todayKey);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {zallar.map((zal) => {
        const palette = getZalColor(zal.id, zallar);
        const dolu = isDoluBugun(zal.id);
        const color = dolu ? DOLU_RENGI : palette;
        const image = getHallImage(zal.id, zallar);
        return (
          <Link
            key={zal.id}
            to={`/zal/${zal.id}`}
            className={`relative rounded-xl border ${color.border} ${color.soft} overflow-hidden hover:brightness-110 transition-all p-4`}
          >
            <img
              src={image}
              alt=""
              className="pointer-events-none select-none absolute -right-2 -bottom-2 h-[150%] w-auto object-contain opacity-40 mix-blend-screen"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                <p className="text-white font-medium truncate">{zal.ad}</p>
                {dolu && (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    Dolu
                  </span>
                )}
              </div>
              <p className={`text-xs ${color.text}`}>{upcomingCount(zal.id)} yaxın gələcək məclis</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
