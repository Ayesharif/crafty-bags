import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getStorage, ref as storagerf, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { getDatabase, get, set, onValue, ref as databaserf, child, remove } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getAuth, onAuthStateChanged,GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence,sendEmailVerification , sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGLGMEggqRvLPKzC3QI3MK0IFG7xmcbMU",
  authDomain: "fir-605e0.firebaseapp.com",
  projectId: "fir-605e0",
  storageBucket: "fir-605e0.appspot.com",
  messagingSenderId: "99653478345",
  appId: "1:99653478345:web:12bc1674a68b6693f36a18"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getDatabase(app);
const storage=getStorage(app);
// console.log(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

export{auth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup, createUserWithEmailAndPassword,setPersistence, onValue, remove, browserSessionPersistence, getDatabase, sendEmailVerification ,sendPasswordResetEmail, signInWithEmailAndPassword, signOut, db, get, set, databaserf, storage, storagerf,uploadBytes, getDownloadURL, child, };

