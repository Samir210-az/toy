import { useMemo, useState } from 'react';
import { addMeclis } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

const PRESET_XIDMETLER = [
  { key: 'disklər', label: 'Disklər (DJ)' },
  { key: 'masin', label: 'Maşın' },
  { key: 'klip', label: 'Klip (video)' },
  { key: 'reqsQrupu', label: 'Rəqs qrupu' },
];

const BOS_FORM = {
  zalId: '',
  adFamiliya: '',
  telefon: '',
  tarix: '',
  saat: '19:00',
  qonaqSayi: '',
  menyuQiymeti: '',
  disklər: '',
  masin: '',
  klip: '',
  reqsQrupu: '',
};

export default function AddEventModal({ zallar, onClose }) {
  const { customerId } = useAuth();
  const [form, setForm] = useState(BOS_FORM);
  const [elaveXerclər, setElaveXerclər] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addXercRow() {
    setElaveXerclər((rows) => [...rows, { ad: '', qiymet: '' }]);
  }

  function updateXercRow(index, field, value) {
    setElaveXerclər((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function removeXercRow(index) {
    setElaveXerclər((rows) => rows.filter((_, i) => i !== index));
  }

  const cemi = useMemo(() => {
    const menyuCemi = (Number(form.qonaqSayi) || 0) * (Number(form.menyuQiymeti) || 0);
    const presetCemi = PRESET_XIDMETLER.reduce(
      (sum, { key }) => sum + (Number(form[key]) || 0),
      0
    );
    const xercCemi = elaveXerclər.reduce((sum, row) => sum + (Number(row.qiymet) || 0), 0);
    return menyuCemi + presetCemi + xercCemi;
  }, [form, elaveXerclər]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.zalId || !form.tarix || !form.adFamiliya) {
      setError('Zal, tarix və ad familiya doldurulmalıdır.');
      return;
    }

    setSaving(true);
    try {
      await addMeclis(customerId, {
        zalId: form.zalId,
        adFamiliya: form.adFamiliya,
        telefon: form.telefon,
        tarix: form.tarix,
        saat: form.saat,
        qonaqSayi: Number(form.qonaqSayi) || 0,
        menyuQiymeti: Number(form.menyuQiymeti) || 0,
        disklər: Number(form.disklər) || 0,
        masin: Number(form.masin) || 0,
        klip: Number(form.klip) || 0,
        reqsQrupu: Number(form.reqsQrupu) || 0,
        elaveXerclər: elaveXerclər.filter((r) => r.ad && r.qiymet),
        cemi,
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
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#161a22] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Toy/Məclis əlavə et</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Zal</label>
              <select
                required
                value={form.zalId}
                onChange={(e) => update('zalId', e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              >
                <option value="">Seçin</option>
                {zallar.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.ad}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Ad Familiya</label>
              <input
                required
                value={form.adFamiliya}
                onChange={(e) => update('adFamiliya', e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Telefon nömrəsi</label>
              <input
                type="tel"
                value={form.telefon}
                onChange={(e) => update('telefon', e.target.value)}
                placeholder="0501234567"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Tarix</label>
              <input
                required
                type="date"
                value={form.tarix}
                onChange={(e) => update('tarix', e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Saat</label>
              <input
                type="time"
                value={form.saat}
                onChange={(e) => update('saat', e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Qonaq sayı</label>
              <input
                type="number"
                min={0}
                value={form.qonaqSayi}
                onChange={(e) => update('qonaqSayi', e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Menyu (1 nəfər, ₼)</label>
              <input
                type="number"
                min={0}
                value={form.menyuQiymeti}
                onChange={(e) => update('menyuQiymeti', e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-300 mb-2">Əlavə xidmətlər (istəyə görə)</p>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_XIDMETLER.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1">{label}</label>
                  <input
                    type="number"
                    min={0}
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder="₼"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-indigo-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Digər xərclər</p>
              <button
                type="button"
                onClick={addXercRow}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                + Xərc əlavə et
              </button>
            </div>
            <div className="space-y-2">
              {elaveXerclər.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Xidmətin adı"
                    value={row.ad}
                    onChange={(e) => updateXercRow(i, 'ad', e.target.value)}
                    className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="₼"
                    value={row.qiymet}
                    onChange={(e) => updateXercRow(i, 'qiymet', e.target.value)}
                    className="w-20 shrink-0 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-sm text-white outline-none focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeXercRow(i)}
                    className="shrink-0 text-gray-500 hover:text-red-400 px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-gray-300">Cəmi</span>
            <span className="text-xl font-semibold text-emerald-400">{cemi.toLocaleString('az-AZ')} ₼</span>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors py-2.5 font-medium text-white disabled:opacity-50"
          >
            {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </form>
      </div>
    </div>
  );
}
