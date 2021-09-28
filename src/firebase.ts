import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCjwW8pAFlmj-OEsIpW2t8U4xhre-C7PbU',
  authDomain: 'gyfa-9b335.firebaseapp.com',
  projectId: 'gyfa-9b335',
  storageBucket: 'gyfa-9b335.appspot.com',
  messagingSenderId: '87280513436',
  appId: '1:87280513436:web:5c412fca92fcae7f0f9859',
  measurementId: 'G-G3P9G0RSBR',
}

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()

export { firebase, firestore }
