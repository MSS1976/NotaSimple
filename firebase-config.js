// firebase-config.js

var firebaseConfig = {
  apiKey: "AIzaSyCg69Kx_awVyR_ynQjI9FJi-hnR0FrD8Ks",
  authDomain: "cuaderno-simple-642e3.firebaseapp.com",
  databaseURL: "https://cuaderno-simple-642e3-default-rtdb.firebaseio.com",
  projectId: "cuaderno-simple-642e3",
  storageBucket: "cuaderno-simple-642e3.appspot.com",
  messagingSenderId: "642984834060",
  appId: "1:642984834060:web:f139c573ea6f0e117bea29"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Referencia a Realtime Database
const db = firebase.database();

// Exportamos la referencia para usarla en app.js
window.notesRef = db.ref("notes");
