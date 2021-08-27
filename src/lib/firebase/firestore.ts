import './init';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

export const useFireStore = () => {
  return db;
};
