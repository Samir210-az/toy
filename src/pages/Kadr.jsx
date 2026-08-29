import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  subscribeKadrOdenisleri,
  addKadrOdenis,
  deleteKadrOdenis,
  subscribeMeclisler,
  subscribeZallar,
} from '../utils/db';
import Footer from '../components/Footer';

const ROLLAR = ['Ofisiant', 'Musiqiçi', 'Aşpaz', 'Salatçı', 'Xadimə'];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function OdenisForm({ meclisler, zallar, onClose, customerId }) {
  const [rol, setRol] = useState('');
  const [customRol, setCustomRol] = useState('');
  const [ad, setAd] = useState('');
  const [meblegh, setMeblegh] = useState('');
  const [sayNefer, setSayNefer] = useState('');
  const [vahidMevacib, setVahidMevacib] = useState('');
  const [tarix, setTarix] = useState(todayStr());
  const [meclisId, setMeclisId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isCustom = rol === '__custom__';
  const secilmisRol = isCustom ? customRol.trim() : rol;
  const isOfisiant = rol === 'Ofisiant';
  const hesablanmisMeblegh = isOfisiant ? (Number(sayNefer) || 0) * (Number(vahidMevacib) || 0) : Number(meblegh) || 0;

  const meclisSiyahisi = useMemo(
    () => [...meclisler].sort((a, b) => b.tarix.localeCompare(a.tarix)),
    [meclisler]
  );
  const secilmisMeclis = meclisSiyahisi.find((m) => m.id === meclisId);
  const zalAdi = (zalId) => zallar.find((z) => z.id === zalId)?.ad || '';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!secilmisRol) {
      setError('Vəzifə seçilməlidir.');
      return;
    }
    if (isOfisiant) {
      if (!sayNefer || Number(sayNefer) <= 0) {
        setError('Nəfər sayı düzgün daxil edilməlidir.');
        return;
      }
      if (!vahidMevacib || Number(vahidMevacib) <= 0) {
        setError('Bir nəfərə məvacib düzgün daxil edilməlidir.');
        return;
      }
    } else if (!meblegh || Number(meblegh) <= 0) {
      setError('Məbləğ düzgün daxil edilməlidir.');
      return;
    }
    setSaving(true);
    try {
      await addKadrOdenis(customerId, {
        rol: secilmisRol,
        ad: ad.trim() || null,
        meblegh: hesablanmisMeblegh,
        sayNefer: isOfisiant ? Number(sayNefer) : null,
        vahidMevacib: isOfisiant ? Number(vahidMevacib) : null,
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
          <h2 className="text-lg font-semibold text-white">Ödəniş qeydə al</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Vəzifə</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
            >
              <option value="">Seçin</option>
              {ROLLAR.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="__custom__">Digər (özün yaz)...</option>
            </select>
            {isCustom && (
              <input
                autoFocus
                value={customRol}
                onChange={(e) => setCustomRol(e.target.value)}
                placeholder="Vəzifənin adı"
                className="w-full mt-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            )}
          </div>

          {!isOfisiant && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Ad (istəyə görə)</label>
              <input
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="İşçinin adı"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>
          )}

          {isOfisiant ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nəfər sayı</label>
                <input
                  type="number"
                  min={0}
                  value={sayNefer}
                  onChange={(e) => setSayNefer(e.target.value)}
                  placeholder="20"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">1 nəfərə məvacib (₼)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={vahidMevacib}
                  onChange={(e) => setVahidMevacib(e.target.value)}
                  placeholder="40"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
                />
              </div>
              {hesablanmisMeblegh > 0 && (
                <p className="col-span-2 text-xs text-gray-500">
                  {sayNefer || 0} × {vahidMevacib || 0} ₼ = <span className="text-rose-400 font-medium">{hesablanmisMeblegh.toLocaleString('az-AZ')} ₼</span>
                </p>
              )}
            </div>
          ) : (
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
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Tarix</label>
            <input
              type="date"
              value={tarix}
              onChange={(e) => setTarix(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
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
            className="w-full rounded-lg bg-rose-500 hover:bg-rose-400 transition-colors py-2.5 font-medium text-white disabled:opacity-50"
          >
            {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Kadr() {
  const { customerId } = useAuth();
  const [odenisler, setOdenisler] = useState([]);
  const [meclisler, setMeclisler] = useState([]);
  const [zallar, setZallar] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const unsub1 = subscribeKadrOdenisleri(customerId, setOdenisler);
    const unsub2 = subscribeMeclisler(customerId, setMeclisler);
    const unsub3 = subscribeZallar(customerId, setZallar);
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [customerId]);

  const cemi = useMemo(() => odenisler.reduce((s, o) => s + (Number(o.meblegh) || 0), 0), [odenisler]);

  const perRol = useMemo(() => {
    const map = {};
    for (const o of odenisler) {
      map[o.rol] = (map[o.rol] || 0) + (Number(o.meblegh) || 0);
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [odenisler]);

  async function handleDelete(id) {
    await deleteKadrOdenis(customerId, id);
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
            <h1 className="text-white font-semibold">Kadr Ödənişləri</h1>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-rose-500 hover:bg-rose-400 transition-colors px-3 py-2 text-sm font-medium text-white"
          >
            + Ödəniş qeydə al
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-white/0 p-4 sm:p-5">
          <p className="text-xs text-gray-500 mb-1">Ümumi kadr xərci</p>
          <p className="text-2xl font-semibold text-rose-400 mb-4">{cemi.toLocaleString('az-AZ')} ₼</p>

          {perRol.length > 0 && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              {perRol.map(([rol, total]) => (
                <div key={rol} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{rol}</span>
                  <span className="text-white font-medium">{total.toLocaleString('az-AZ')} ₼</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-white font-medium mb-3">Ödənişlər tarixçəsi</p>
          <div className="space-y-2">
            {odenisler.length === 0 && (
              <p className="text-sm text-gray-500">Hələ heç bir qeyd yoxdur.</p>
            )}
            {odenisler.map((o) => (
              <div
                key={o.id}
                className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">
                    {o.rol}
                    {o.sayNefer ? ` — ${o.sayNefer} nəfər × ${o.vahidMevacib} ₼` : o.ad ? ` — ${o.ad}` : ''}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {o.tarix}{o.meclisAd ? ` · 🎊 ${o.meclisAd}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-rose-400 font-medium">{Number(o.meblegh).toLocaleString('az-AZ')} ₼</span>
                  {confirmDeleteId === o.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(o.id)}
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
                      onClick={() => setConfirmDeleteId(o.id)}
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
        <OdenisForm meclisler={meclisler} zallar={zallar} onClose={() => setFormOpen(false)} customerId={customerId} />
      )}
    </div>
  );
}
