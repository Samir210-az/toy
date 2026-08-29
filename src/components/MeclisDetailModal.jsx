import { useState } from 'react';
import { deleteMeclis } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

const PRESET_LABELS = {
  disklər: 'Disklər (DJ)',
  masin: 'Maşın',
  klip: 'Klip (video)',
  reqsQrupu: 'Rəqs qrupu',
};

export default function MeclisDetailModal({ meclis, zalAdi, onClose }) {
  const { customerId } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteMeclis(customerId, meclis.id);
    onClose();
  }

  const menyuCemi = (meclis.qonaqSayi || 0) * (meclis.menyuQiymeti || 0);
  const presetXidmetler = Object.entries(PRESET_LABELS).filter(([key]) => meclis[key] > 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#161a22] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{meclis.adFamiliya}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="Zal" value={zalAdi} />
          {meclis.telefon && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Telefon</span>
              <div className="flex items-center gap-2">
                <span className="text-white">{meclis.telefon}</span>
                <a
                  href={`tel:${meclis.telefon.replace(/\s/g, '')}`}
                  className="w-8 h-8 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 flex items-center justify-center text-indigo-400 transition-colors"
                  title="Zəng et"
                >
                  📞
                </a>
                <a
                  href={`https://wa.me/${meclis.telefon.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 flex items-center justify-center text-emerald-400 transition-colors"
                  title="WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>
          )}
          <Row label="Tarix" value={meclis.tarix} />
          <Row label="Saat" value={meclis.saat} />
          <Row label="Qonaq sayı" value={meclis.qonaqSayi} />
          <Row label="Menyu (1 nəfər)" value={`${meclis.menyuQiymeti} ₼`} />
          <Row label="Menyu cəmi" value={`${menyuCemi.toLocaleString('az-AZ')} ₼`} />

          {presetXidmetler.length > 0 && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              {presetXidmetler.map(([key, label]) => (
                <Row key={key} label={label} value={`${meclis[key]} ₼`} />
              ))}
            </div>
          )}

          {meclis.elaveXerclər?.length > 0 && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              <p className="text-gray-400">Digər xərclər</p>
              {meclis.elaveXerclər.map((xerc, i) => (
                <Row key={i} label={xerc.ad} value={`${xerc.qiymet} ₼`} />
              ))}
            </div>
          )}

          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-gray-300 font-medium">Yekun cəmi</span>
            <span className="text-xl font-semibold text-emerald-400">
              {meclis.cemi?.toLocaleString('az-AZ')} ₼
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 mt-5 pt-4">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors py-2 text-sm"
            >
              Məclisi sil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 hover:bg-red-400 transition-colors py-2 text-sm text-white disabled:opacity-50"
              >
                {deleting ? 'Silinir...' : 'Bəli, sil'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg border border-white/10 text-gray-400 py-2 text-sm"
              >
                Ləğv et
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
