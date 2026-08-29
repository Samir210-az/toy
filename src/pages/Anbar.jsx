import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscribeAnbarHereketleri, addAnbarHereket, deleteAnbarHereket } from '../utils/db';
import Footer from '../components/Footer';

const PRESET_MEHSULLAR = [
  'Quzu əti', 'Mal əti', 'Toyuq', 'Balıq',
  'Xiyar', 'Pomidor', 'Kartof', 'Soğan', 'Yaşıl göyərti',
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function HereketForm({ tip, mehsullar, onClose, customerId }) {
  const [mehsul, setMehsul] = useState('');
  const [customMehsul, setCustomMehsul] = useState('');
  const [miqdar, setMiqdar] = useState('');
  const [qiymetKq, setQiymetKq] = useState('');
  const [tarix, setTarix] = useState(todayStr());
  const [qeyd, setQeyd] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const secilmisMehsul = mehsul === '__custom__' ? customMehsul.trim() : mehsul;
  const cemi = tip === 'giris' ? (Number(miqdar) || 0) * (Number(qiymetKq) || 0) : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!secilmisMehsul) {
      setError('Məhsul seçilməlidir.');
      return;
    }
    if (!miqdar || Number(miqdar) <= 0) {
      setError('Miqdar (kq) düzgün daxil edilməlidir.');
      return;
    }
    setSaving(true);
    try {
      await addAnbarHereket(customerId, {
        tip,
        mehsul: secilmisMehsul,
        miqdar: Number(miqdar),
        qiymetKq: tip === 'giris' ? Number(qiymetKq) || 0 : null,
        cemi: tip === 'giris' ? cemi : null,
        tarix,
        qeyd: qeyd.trim() || null,
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
          <h2 className="text-lg font-semibold text-white">
            {tip === 'giris' ? 'Anbara qəbul (giriş)' : 'Anbardan çıxış'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Məhsul</label>
            <select
              value={mehsul}
              onChange={(e) => setMehsul(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
            >
              <option value="">Seçin</option>
              {mehsullar.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__custom__">Digər (özün yaz)...</option>
            </select>
            {mehsul === '__custom__' && (
              <input
                autoFocus
                value={customMehsul}
                onChange={(e) => setCustomMehsul(e.target.value)}
                placeholder="Məhsulun adı"
                className="w-full mt-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Miqdar (kq)</label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={miqdar}
                onChange={(e) => setMiqdar(e.target.value)}
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

          {tip === 'giris' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Qiymət (1 kq, ₼)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={qiymetKq}
                onChange={(e) => setQiymetKq(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
              {cemi !== null && cemi > 0 && (
                <p className="text-xs text-gray-500 mt-1">Cəmi: {cemi.toLocaleString('az-AZ')} ₼</p>
              )}
            </div>
          )}

          {tip === 'cixis' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Qeyd (istəyə görə)</label>
              <input
                value={qeyd}
                onChange={(e) => setQeyd(e.target.value)}
                placeholder="Məs: Əli bəyin toyu üçün"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className={`w-full rounded-lg py-2.5 font-medium text-white disabled:opacity-50 transition-colors ${
              tip === 'giris' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-orange-500 hover:bg-orange-400'
            }`}
          >
            {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Anbar() {
  const { customerId } = useAuth();
  const [hereketler, setHereketler] = useState([]);
  const [formTip, setFormTip] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    return subscribeAnbarHereketleri(customerId, setHereketler);
  }, [customerId]);

  const mehsulList = useMemo(() => {
    const names = new Set(PRESET_MEHSULLAR);
    hereketler.forEach((h) => names.add(h.mehsul));
    return [...names];
  }, [hereketler]);

  const qaliqlar = useMemo(() => {
    const map = {};
    for (const h of hereketler) {
      if (!map[h.mehsul]) map[h.mehsul] = 0;
      map[h.mehsul] += h.tip === 'giris' ? h.miqdar : -h.miqdar;
    }
    return mehsulList
      .map((m) => ({ mehsul: m, qaliq: map[m] || 0 }))
      .filter((x) => x.qaliq !== 0 || PRESET_MEHSULLAR.includes(x.mehsul))
      .sort((a, b) => b.qaliq - a.qaliq);
  }, [hereketler, mehsulList]);

  async function handleDelete(id) {
    await deleteAnbarHereket(customerId, id);
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
            <h1 className="text-white font-semibold">Anbar</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormTip('giris')}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 transition-colors px-3 py-2 text-sm font-medium text-white"
            >
              + Giriş
            </button>
            <button
              onClick={() => setFormTip('cixis')}
              className="rounded-lg bg-orange-500 hover:bg-orange-400 transition-colors px-3 py-2 text-sm font-medium text-white"
            >
              − Çıxış
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-white font-medium mb-3">Cari qalıqlar</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {qaliqlar.map(({ mehsul, qaliq }) => (
              <div key={mehsul} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-sm text-white truncate">{mehsul}</p>
                <p className={`text-lg font-semibold ${qaliq < 0 ? 'text-red-400' : qaliq === 0 ? 'text-gray-500' : 'text-emerald-400'}`}>
                  {qaliq.toLocaleString('az-AZ')} kq
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-white font-medium mb-3">Hərəkətlər tarixçəsi</p>
          <div className="space-y-2">
            {hereketler.length === 0 && (
              <p className="text-sm text-gray-500">Hələ heç bir qeyd yoxdur.</p>
            )}
            {hereketler.map((h) => (
              <div
                key={h.id}
                className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded ${
                      h.tip === 'giris' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-300'
                    }`}
                  >
                    {h.tip === 'giris' ? 'Giriş' : 'Çıxış'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">{h.mehsul}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {h.tarix} · {h.miqdar} kq
                      {h.tip === 'giris' && h.qiymetKq ? ` · ${h.qiymetKq} ₼/kq` : ''}
                      {h.qeyd ? ` · ${h.qeyd}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {h.tip === 'giris' && h.cemi > 0 && (
                    <span className="text-sm text-emerald-400 font-medium">{h.cemi.toLocaleString('az-AZ')} ₼</span>
                  )}
                  {confirmDeleteId === h.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(h.id)}
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
                      onClick={() => setConfirmDeleteId(h.id)}
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

      {formTip && (
        <HereketForm tip={formTip} mehsullar={mehsulList} onClose={() => setFormTip(null)} customerId={customerId} />
      )}
    </div>
  );
}
