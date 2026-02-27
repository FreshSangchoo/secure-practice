import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, collection, doc,
  getDocs, setDoc, deleteDoc, query, where,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function fsLoad(pageId) {
  try {
    const q    = query(collection(db, 'annotations'), where('pageId', '==', pageId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch {
    return null;
  }
}

export async function fsSave(ann) {
  try {
    await setDoc(doc(db, 'annotations', ann.id), ann);
  } catch {}
}

export async function fsDelete(id) {
  try {
    await deleteDoc(doc(db, 'annotations', id));
  } catch {}
}
