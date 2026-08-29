import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginCustomer } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { customerId } = await loginCustomer(phone, pin);
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
        <h1 className="text-2xl font-semibold text-white mb-6">Daxil olun</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Telefon nömrəsi</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 transition-colors"
              placeholder="0501234567"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">PIN kod</label>
            <input
              required
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors py-2.5 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Yoxlanılır...' : 'Daxil ol'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Hesabınız yoxdur?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </div>
  );
}
