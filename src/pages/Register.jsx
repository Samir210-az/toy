import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomer } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ restoranAdi: '', phone: '', pin: '', zalSayi: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.pin.length < 4) {
      setError('PIN kodu ən azı 4 rəqəm olmalıdır.');
      return;
    }
    if (form.zalSayi < 1) {
      setError('Ən azı 1 zal göstərilməlidir.');
      return;
    }

    setLoading(true);
    try {
      const customerId = await registerCustomer(form);
      login(customerId);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#0f1115] to-[#161a22]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white mb-1">Qeydiyyat</h1>
        <p className="text-gray-400 text-sm mb-6">7 gün pulsuz sınaq müddəti ilə başlayın</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Restoran / məkan adı</label>
            <input
              required
              value={form.restoranAdi}
              onChange={(e) => update('restoranAdi', e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 transition-colors"
              placeholder="Məsələn: Hollywood Restoran"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Telefon nömrəsi</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 transition-colors"
              placeholder="0501234567"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">PIN kod (giriş üçün)</label>
            <input
              required
              type="password"
              inputMode="numeric"
              value={form.pin}
              onChange={(e) => update('pin', e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 transition-colors"
              placeholder="4 rəqəmli PIN"
              maxLength={8}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Neçə zalınız var?</label>
            <input
              required
              type="number"
              min={1}
              value={form.zalSayi}
              onChange={(e) => update('zalSayi', Number(e.target.value))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors py-2.5 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Yaradılır...' : 'Qeydiyyatdan keç'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Artıq hesabınız var?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Daxil olun
          </Link>
        </p>
      </div>
    </div>
  );
}
