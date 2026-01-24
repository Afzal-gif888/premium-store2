import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const productsRef = collection(db, "products");

export const addProduct = (data) => addDoc(productsRef, data);
export const getProducts = () => getDocs(productsRef);
export const updateProduct = (id, data) =>
  updateDoc(doc(db, "products", id), data);
export const deleteProduct = (id) =>
  deleteDoc(doc(db, "products", id));
