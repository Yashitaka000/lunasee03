import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { User } from '../types';

export async function saveUser(userId: string, userData: User) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, { trackedUsers: [] });
  }

  const trackedUsersRef = collection(userRef, 'trackedUsers');
  await setDoc(doc(trackedUsersRef), userData);
}

export async function getTrackedUsers(userId: string): Promise<User[]> {
  const userRef = doc(db, 'users', userId);
  const trackedUsersRef = collection(userRef, 'trackedUsers');
  const snapshot = await getDocs(trackedUsersRef);
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    lastPeriodStart: doc.data().lastPeriodStart.toDate(),
  } as User));
}