/* ========================================
   Firebase Firestore 초기화 & CRUD 헬퍼
   ======================================== */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, collection, doc,
  getDocs, setDoc, deleteDoc, query, where,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const app = initializeApp({
  apiKey:            'AIzaSyCqchTnLHC0I4xApiM4ifyXr78T33avUNo',
  authDomain:        'aws--memo.firebaseapp.com',
  projectId:         'aws--memo',
  storageBucket:     'aws--memo.firebasestorage.app',
  messagingSenderId: '664815808028',
  appId:             '1:664815808028:web:63a5ff3e11176852c079d9',
});

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
