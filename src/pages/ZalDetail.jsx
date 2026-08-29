import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscribeZallar, subscribeMeclisler } from '../utils/db';
import { getZalColor } from '../utils/colors';
import { getHallImage } from '../utils/hallImages';
import Calendar from '../components/Calendar';
import MeclisDetailModal from '../components/MeclisDetailModal';
import Footer from '../components/Footer';

export default function ZalDetail() {
  const { zalId } = useParams();
  const { customerId } = useAuth();
  const [zallar, setZallar] = useState([]);
  const [meclisler, setMeclisler] = useState([]);
  const [detailMeclis, setDetailMeclis] = useState(null);

  useEffect(() => {
    const unsub1 = subscribeZallar(customerId, setZallar);
    const unsub2 = subscribeMeclisler(customerId, setMeclisler);
    return () => {
      unsub1();
      unsub2();
    };
  }, [customerId]);

  const zal = zallar.find((z) => z.id === zalId);
  const zalMeclisler = useMemo(
    () => meclisler.filter((m) => m.zalId === zalId).sort((a, b) => a.tarix.localeCompare(b.tarix)),
    [meclisler, zalId]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const gelecekMeclisler = zalMeclisler.filter((m) => new Date(m.tarix) >= today);
  const kecmisMeclisler = zalMeclisler.filter((m) => new Date(m.tarix) < today);

  const color = getZalColor(zalId, zallar);

  if (!zal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
        <p className="text-gray-500 text-sm">Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1115]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white text-xl leading-none">
            ‹
          </Link>
          <span className={`w-3 h-3 rounded-full ${color.dot}`} />
          <h1 className="text-white font-semibold">{zal.ad}</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Calendar
          zallar={zallar.filter((z) => z.id === zalId)}
          meclisler={zalMeclisler}
          bgImage={getHallImage(zalId, zallar)}
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-white font-medium mb-3">Gələcək məclislər ({gelecekMeclisler.length})</p>
          <div className="space-y-2">
            {gelecekMeclisler.length === 0 && (
              <p className="text-sm text-gray-500">Bu zal üçün planlaşdırılmış məclis yoxdur.</p>
            )}
            {gelecekMeclisler.map((m) => (
              <button
                key={m.id}
                onClick={() => setDetailMeclis(m)}
                className={`w-full text-left rounded-lg bg-white/5 border ${color.border} hover:bg-white/10 transition-colors p-3 flex items-center justify-between`}
              >
                <div>
                  <p className="text-white text-sm font-medium">{m.adFamiliya}</p>
                  <p className="text-xs text-gray-500">
                    {m.tarix} · {m.saat} · {m.qonaqSayi} qonaq
                  </p>
                </div>
                <p className="text-sm text-emerald-400 font-medium">{m.cemi} ₼</p>
              </button>
            ))}
          </div>
        </div>

        {kecmisMeclisler.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-white font-medium mb-3">Keçmiş məclislər ({kecmisMeclisler.length})</p>
            <div className="space-y-2">
              {kecmisMeclisler.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setDetailMeclis(m)}
                  className="w-full text-left rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-3 flex items-center justify-between opacity-60"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{m.adFamiliya}</p>
                    <p className="text-xs text-gray-500">
                      {m.tarix} · {m.saat} · {m.qonaqSayi} qonaq
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">{m.cemi} ₼</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {detailMeclis && (
        <MeclisDetailModal meclis={detailMeclis} zalAdi={zal.ad} onClose={() => setDetailMeclis(null)} />
      )}
    </div>
  );
}
