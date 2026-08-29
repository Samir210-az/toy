import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  subscribeDigerXerclar,
  addDigerXerc,
  deleteDigerXerc,
  subscribeMeclisler,
  subscribeZallar,
} from '../utils/db';
import Footer from '../components/Footer';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function XercForm({ meclisler, zallar, onClose, customerId }) {
  const [ad, setAd] = useState('');
  const [meblegh, setMeblegh] = useState('');
  const [tarix, setTarix] = useState(todayStr());
  const [meclisId, setMeclisId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const meclisSiyahisi = useMemo(
    () => [...meclisler].sort((a, b) => b.tarix.localeCompare(a.tarix)),
    [meclisler]
  );
  const secilmisMeclis = meclisSiyahisi.find((m) => m.id === meclisId);
  const zalAdi = (zalId) => zallar.find((z) => z.id === zalId)?.ad || '';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!ad.trim()) {
      setError('Xərcin adı yazılmalıdır.');
      return;
    }
    if (!meblegh || Number(meblegh) <= 0) {
      setError('Məbləğ düzgün daxil edilməlidir.');
      return;
    }
    setSaving(true);
    try {
      await addDigerXerc(customerId, {
        ad: ad.trim(),
        meblegh: Number(meblegh),
        tarix,
        meclisId: secilmisMeclis ? secilmisMeclis.id : null,
        meclisAd: secilmisMeclis ? secilmisMeclis.adFamiliya : null,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161a22] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Xərc əlavə et</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Xərcin adı</label>
            <input
              autoFocus
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              placeholder="Məs: İcarə haqqı, İşıq haqqı, Təmir"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Məbləğ (₼)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={meblegh}
                onChange={(e) => setMeblegh(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Tarix</label>
              <input
                type="date"
                value={tarix}
                onChange={(e) => setTarix(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Hansı toy üçün? (istəyə görə)</label>
            <select
              value={meclisId}
              onChange={(e) => setMeclisId(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
            >
              <option value="">Ümumi / toya aid deyil</option>
              {meclisSiyahisi.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.adFamiliya} — {m.tarix} ({zalAdi(m.zalId)})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors py-2.5 font-medium text-white disabled:opacity-50"
          >
            {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DigerXerclar() {
  const { customerId } = useAuth();
  const [xerclar, setXerclar] = useState([]);
  const [meclisler, setMeclisler] = useState([]);
  const [zallar, setZallar] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const unsub1 = subscribeDigerXerclar(customerId, setXerclar);
    const unsub2 = subscribeMeclisler(customerId, setMeclisler);
    const unsub3 = subscribeZallar(customerId, setZallar);
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [customerId]);

  const cemi = useMemo(() => xerclar.reduce((s, x) => s + (Number(x.meblegh) || 0), 0), [xerclar]);

  async function handleDelete(id) {
    await deleteDigerXerc(customerId, id);
    setConfirmDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1115]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-white text-xl leading-none">
              ‹
            </Link>
            <h1 className="text-white font-semibold">Digər Xərclər</h1>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors px-3 py-2 text-sm font-medium text-white"
          >
            + Xərc əlavə et
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-white/0 p-4 sm:p-5">
          <p className="text-xs text-gray-500 mb-1">Ümumi digər xərclər</p>
          <p className="text-2xl font-semibold text-amber-400">{cemi.toLocaleString('az-AZ')} ₼</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-white font-medium mb-3">Xərclər tarixçəsi</p>
          <div className="space-y-2">
            {xerclar.length === 0 && (
              <p className="text-sm text-gray-500">Hələ heç bir qeyd yoxdur.</p>
            )}
            {xerclar.map((x) => (
              <div
                key={x.id}
                className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{x.ad}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {x.tarix}{x.meclisAd ? ` · 🎊 ${x.meclisAd}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-amber-400 font-medium">{Number(x.meblegh).toLocaleString('az-AZ')} ₼</span>
                  {confirmDeleteId === x.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(x.id)}
                        className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-400 text-white"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs px-2 py-1 rounded border border-white/10 text-gray-400"
                      >
                        Ləğv
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(x.id)}
                      className="text-gray-600 hover:text-red-400 text-sm px-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {formOpen && (
        <XercForm meclisler={meclisler} zallar={zallar} onClose={() => setFormOpen(false)} customerId={customerId} />
      )}
    </div>
  );
}
