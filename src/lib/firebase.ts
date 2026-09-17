import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Pelanggan, 
  AppUser, 
  JadwalPengangkutan, 
  LaporanSampah, 
  AppNotification, 
  LogUpdateBanjar 
} from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must specify firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test Firestore Connection on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore: client is offline or network is disconnected.');
    } else {
      console.log('Firebase connection initialized.');
    }
    return false;
  }
}

// Fire initial connection test
testConnection();

// Standard Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ----------------------------------------------------
// Realtime Subscriptions & Persistence Helpers
// ----------------------------------------------------

/**
 * Real-time listener for Pelanggan collection
 */
export function subscribeToPelanggan(
  onData: (data: Pelanggan[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'pelanggan';
  const collRef = collection(db, path);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: Pelanggan[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Pelanggan);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Save / Update a Pelanggan in Firestore
 */
export async function syncPelangganToCloud(pelanggan: Pelanggan): Promise<void> {
  const path = `pelanggan/${pelanggan.id}`;
  try {
    await setDoc(doc(db, 'pelanggan', pelanggan.id), pelanggan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Batch upload / seed Pelanggan list to Firestore
 */
export async function batchSyncPelanggan(list: Pelanggan[]): Promise<void> {
  const path = 'pelanggan';
  try {
    const batch = writeBatch(db);
    list.forEach((item) => {
      const ref = doc(db, 'pelanggan', item.id);
      batch.set(ref, item);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a Pelanggan from Firestore
 */
export async function deletePelangganFromCloud(id: string): Promise<void> {
  const path = `pelanggan/${id}`;
  try {
    await deleteDoc(doc(db, 'pelanggan', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for App Users (Admin & Petugas)
 */
export function subscribeToUsers(
  onData: (data: AppUser[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'users';
  const collRef = collection(db, path);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: AppUser[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as AppUser);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Save / Register an App User in Firestore
 */
export async function syncUserToCloud(user: AppUser): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete User from Firestore
 */
export async function deleteUserFromCloud(id: string): Promise<void> {
  const path = `users/${id}`;
  try {
    await deleteDoc(doc(db, 'users', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for Jadwal Pengangkutan
 */
export function subscribeToJadwal(
  onData: (data: JadwalPengangkutan[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'jadwal';
  const collRef = collection(db, path);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: JadwalPengangkutan[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as JadwalPengangkutan);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function syncJadwalToCloud(jadwal: JadwalPengangkutan): Promise<void> {
  const path = `jadwal/${jadwal.id}`;
  try {
    await setDoc(doc(db, 'jadwal', jadwal.id), jadwal);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Laporan Keluhan
 */
export function subscribeToLaporan(
  onData: (data: LaporanSampah[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'laporan';
  const collRef = collection(db, path);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: LaporanSampah[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as LaporanSampah);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function syncLaporanToCloud(laporan: LaporanSampah): Promise<void> {
  const path = `laporan/${laporan.id}`;
  try {
    await setDoc(doc(db, 'laporan', laporan.id), laporan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Notifikasi
 */
export function subscribeToNotifikasi(
  onData: (data: AppNotification[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'notifikasi';
  const collRef = collection(db, path);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as AppNotification);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function syncNotifikasiToCloud(notif: AppNotification): Promise<void> {
  const path = `notifikasi/${notif.id}`;
  try {
    await setDoc(doc(db, 'notifikasi', notif.id), notif);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Logs Banjar
 */
export function subscribeToLogsBanjar(
  onData: (data: LogUpdateBanjar[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'logsBanjar';
  const collRef = collection(db, path);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: LogUpdateBanjar[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as LogUpdateBanjar);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function syncLogBanjarToCloud(log: LogUpdateBanjar): Promise<void> {
  const path = `logsBanjar/${log.id}`;
  try {
    await setDoc(doc(db, 'logsBanjar', log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Check if Firestore has existing pelanggan data
 */
export async function getCloudPelangganCount(): Promise<number> {
  const path = 'pelanggan';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.size;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
