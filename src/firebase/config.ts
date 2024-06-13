
import { initializeApp } from "firebase/app";
import {getStorage, uploadBytes, ref} from 'firebase/storage'
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: "735044721951",
  appId: process.env.FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);

export const storageFirebase = getStorage(app)

export const  uploadFile = async (file:any) => {
  const storageRef = ref(storageFirebase)
  try {
    const response = await uploadBytes(storageRef, file)
    return {
      error:false,
      data:null,
      message:"OK"
    }
  } catch (error) {
    return {
      error:true,
      data:null,
      message:"Ocurrió un error al subir el archivo"
    }
  }
}