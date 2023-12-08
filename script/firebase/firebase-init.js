import { initializeApp } from "./firebase-app.js";
import { getDatabase } from "./firebase-database.js";
import { getAuth } from './firebase-auth.js';
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app, "https://keyboardwarrior-c0a0b-default-rtdb.asia-southeast1.firebasedatabase.app");
const auth = getAuth(app);

export { app, auth, database };


// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js'
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js'
// import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js'