import { Link } from 'react-router-dom';
import { getZalColor } from '../utils/colors';
import { getHallImage } from '../utils/hallImages';

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
        const image = getHallImage(zal.id, zallar);
        return (
          <Link
            key={zal.id}
            to={`/zal/${zal.id}`}
            className={`relative rounded-xl border ${color.border} overflow-hidden hover:brightness-110 transition-all`}
          >
            <div className="h-24 w-full overflow-hidden bg-white/5">
              <img src={image} alt="" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${color.gradient} via-black/40 to-black/10`} />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                <p className="text-white font-medium truncate">{zal.ad}</p>
              </div>
              <p className={`text-xs ${color.text}`}>{upcomingCount(zal.id)} yaxın gələcək məclis</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
