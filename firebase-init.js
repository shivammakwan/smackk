import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB2Yit8yUc4DcYZQYzkDYLUm4IWv4vOJq8",
  authDomain: "smackk-app.firebaseapp.com",
  projectId: "smackk-app",
  storageBucket: "smackk-app.appspot.com",
  messagingSenderId: "993844777824",
  appId: "1:993844777824:web:8a4457ae6ae1a5c42e4405",
};

export const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
