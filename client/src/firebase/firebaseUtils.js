import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAAmTJ5D6tGFCownMyCHhQkbKGsv1-Ftik',
  authDomain: 'alpha-class-e4f00.firebaseapp.com',
  databaseURL: 'https://alpha-class-e4f00.firebaseio.com',
  projectId: 'alpha-class-e4f00',
  storageBucket: 'alpha-class-e4f00.appspot.com',
  messagingSenderId: '535709035304',
  appId: '1:535709035304:web:630df997dd3dd3a6d3fe1d',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
