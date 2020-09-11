import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDW0dmxyo8YlZ6mwByDU0r-nKdWdKxue48",
  authDomain: "instagram-clone-react-976da.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-976da.firebaseio.com",
  projectId: "instagram-clone-react-976da",
  storageBucket: "instagram-clone-react-976da.appspot.com",
  messagingSenderId: "483757848840",
  appId: "1:483757848840:web:487f1d33f300a86ec3d4bd",
  measurementId: "G-QWT2ME4MR2"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};