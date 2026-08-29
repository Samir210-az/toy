import { db } from '../firebase';
import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
} from 'firebase/database';

const TRIAL_DAYS = 7;
export const ADMIN_PIN = 'AL2026EA';

export function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

// ---------- Müştəri qeydiyyat / giriş ----------

export async function registerCustomer({ restoranAdi, phone, pin, zalSayi }) {
  const customerId = normalizePhone(phone);
  const existing = await get(ref(db, `customers/${customerId}`));
  if (existing.exists()) {
    throw new Error('Bu telefon nömrəsi ilə artıq qeydiyyat var.');
  }

  const now = Date.now();
  const trialEndsAt = now + TRIAL_DAYS * 24 * 60 * 60 * 1000;

  const zallar = {};
  for (let i = 1; i <= zalSayi; i++) {
    const zalId = push(ref(db, `customers/${customerId}/zallar`)).key;
    zallar[zalId] = { ad: `Zal ${i}`, createdAt: now };
  }

  await set(ref(db, `customers/${customerId}`), {
    restoranAdi,
    phone: customerId,
    pin,
    status: 'trial',
    createdAt: now,
    trialEndsAt,
    planType: null,
    planExpiresAt: null,
    zallar,
  });

  return customerId;
}

export async function loginCustomer(phone, pin) {
  const customerId = normalizePhone(phone);
  const snap = await get(ref(db, `customers/${customerId}`));
  if (!snap.exists()) throw new Error('Bu nömrə ilə qeydiyyat tapılmadı.');
  const data = snap.val();
  if (data.pin !== pin) throw new Error('PIN kodu yanlışdır.');
  return { customerId, ...data };
}

export function getAccessState(customer) {
  const now = Date.now();
  if (customer.status === 'active' && customer.planExpiresAt > now) {
    return { access: true, reason: 'active' };
  }
  if (customer.status === 'trial' && customer.trialEndsAt > now) {
    return { access: true, reason: 'trial' };
  }
  return { access: false, reason: 'expired' };
}

export function subscribeCustomer(customerId, callback) {
  return onValue(ref(db, `customers/${customerId}`), (snap) => {
    callback(snap.exists() ? { customerId, ...snap.val() } : null);
  });
}

// ---------- Zallar ----------

export async function addZal(customerId, ad) {
  const zalRef = push(ref(db, `customers/${customerId}/zallar`));
  await set(zalRef, { ad, createdAt: Date.now() });
  return zalRef.key;
}

export function subscribeZallar(customerId, callback) {
  return onValue(ref(db, `customers/${customerId}/zallar`), (snap) => {
    const val = snap.val() || {};
    callback(Object.entries(val).map(([id, z]) => ({ id, ...z })));
  });
}

// ---------- Məclislər ----------

export function subscribeMeclisler(customerId, callback) {
  return onValue(ref(db, `customers/${customerId}/meclisler`), (snap) => {
    const val = snap.val() || {};
    callback(Object.entries(val).map(([id, m]) => ({ id, ...m })));
  });
}

export async function checkZalConflict(customerId, zalId, tarix, excludeId = null) {
  const snap = await get(ref(db, `customers/${customerId}/meclisler`));
  const val = snap.val() || {};
  return Object.entries(val).some(
    ([id, m]) => id !== excludeId && m.zalId === zalId && m.tarix === tarix
  );
}

export async function addMeclis(customerId, meclis) {
  const hasConflict = await checkZalConflict(customerId, meclis.zalId, meclis.tarix);
  if (hasConflict) {
    throw new Error('Bu zal həmin tarixdə artıq bron edilib. Başqa zal və ya tarix seçin.');
  }
  const meclisRef = push(ref(db, `customers/${customerId}/meclisler`));
  await set(meclisRef, { ...meclis, createdAt: Date.now() });
  return meclisRef.key;
}

export async function deleteMeclis(customerId, meclisId) {
  await remove(ref(db, `customers/${customerId}/meclisler/${meclisId}`));
}

// ---------- Admin ----------

export function subscribeAllCustomers(callback) {
  return onValue(ref(db, 'customers'), (snap) => {
    const val = snap.val() || {};
    callback(Object.entries(val).map(([id, c]) => ({ id, ...c })));
  });
}

const PLAN_DAYS = { '1ay': 30, '6ay': 182, '1il': 365 };

export async function activatePlan(customerId, planType) {
  const days = PLAN_DAYS[planType];
  if (!days) throw new Error('Naməlum plan növü.');
  const now = Date.now();
  await update(ref(db, `customers/${customerId}`), {
    status: 'active',
    planType,
    planExpiresAt: now + days * 24 * 60 * 60 * 1000,
  });
}

export async function setCustomerStatus(customerId, status) {
  await update(ref(db, `customers/${customerId}`), { status });
}
