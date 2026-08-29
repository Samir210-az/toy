import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { subscribeZallar, subscribeMeclisler, getAccessState } from '../utils/db';
import Header from '../components/Header';
import HallGrid from '../components/HallGrid';
import EmptyDaysCard from '../components/EmptyDaysCard';
import Calendar from '../components/Calendar';
import AddEventModal from '../components/AddEventModal';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { customer, customerId } = useAuth();
  const [zallar, setZallar] = useState([]);
  const [meclisler, setMeclisler] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const unsub1 = subscribeZallar(customerId, setZallar);
    const unsub2 = subscribeMeclisler(customerId, setMeclisler);
    return () => {
      unsub1();
      unsub2();
    };
  }, [customerId]);

  if (!customer) return null;

  const access = getAccessState(customer);

  if (!access.access) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f1115]">
        <div className="max-w-sm text-center">
          <p className="text-white text-lg font-semibold mb-2">Abunəlik bitib</p>
          <p className="text-gray-400 text-sm mb-6">
            Sınaq müddətiniz və ya ödənişli planınız başa çatıb. Davam etmək üçün baş admin ilə
            əlaqə saxlayın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <Header onAddClick={() => setModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {access.reason === 'trial' && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300">
            Pulsuz sınaq müddətindəsiniz —{' '}
            {Math.max(0, Math.ceil((customer.trialEndsAt - Date.now()) / 86400000))} gün qalıb.
          </div>
        )}

        <HallGrid zallar={zallar} meclisler={meclisler} />

        <EmptyDaysCard meclisler={meclisler} />

        <Calendar zallar={zallar} meclisler={meclisler} />
      </main>

      <Footer />

      {modalOpen && <AddEventModal zallar={zallar} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
