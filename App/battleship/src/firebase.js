import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

var config = {
    apiKey: "AIzaSyAGsi3svYyZVdlZoX0fd7pL0kwcVH13F6w",
    authDomain: "battleship-dapp.firebaseapp.com",
    databaseURL: "https://battleship-dapp.firebaseio.com",
    projectId: "battleship-dapp",
    storageBucket: "battleship-dapp.appspot.com",
    messagingSenderId: "854865277698",
    appId: "1:854865277698:web:7904c4a2dfee2f77cb481b",
    measurementId: "G-QD0GZJQ0YQ"
  };
firebase.initializeApp(config);

// firebase.firestore().settings(settings);

export default firebase;