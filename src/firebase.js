import * as firebase from 'firebase';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: 'AIzaSyBT-nGiXVQTxaUMdcVQFHOtFoRKZPDTPS4',
  authDomain: 'courselnk.firebaseapp.com',
  databaseURL: 'https://courselnk.firebaseio.com',
  projectId: 'courselnk',
  storageBucket: 'courselnk.appspot.com',
  messagingSenderId: '285133230874',
  appId: '1:285133230874:web:a36bcd52fb02ce84d892a3',
  measurementId: 'G-FFXLLD8T1Y',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
