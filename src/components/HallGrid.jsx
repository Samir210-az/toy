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
            className={`relative rounded-xl border ${color.border} ${color.soft} overflow-hidden hover:brightness-110 transition-all p-4`}
          >
            <img
              src={image}
              alt=""
              className="pointer-events-none select-none absolute -right-3 -bottom-3 h-[135%] w-auto object-contain opacity-20 mix-blend-screen"
            />
            <div className="relative z-10">
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
