import { Link } from 'react-router-dom';
import { getZalColor } from '../utils/colors';

export default function HallGrid({ zallar, meclisler }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function upcomingCount(zalId) {
    return meclisler.filter((m) => {
      const d = new Date(m.tarix);
      return m.zalId === zalId && d >= today;
    }).length;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {zallar.map((zal) => {
        const color = getZalColor(zal.id, zallar);
        return (
          <Link
            key={zal.id}
            to={`/zal/${zal.id}`}
            className={`rounded-xl border ${color.border} bg-gradient-to-br ${color.gradient} to-white/0 p-4 hover:brightness-125 transition-all`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
              <p className="text-white font-medium truncate">{zal.ad}</p>
            </div>
            <p className={`text-xs ${color.text}`}>{upcomingCount(zal.id)} yaxın gələcək məclis</p>
          </Link>
        );
      })}
    </div>
  );
}
