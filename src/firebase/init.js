import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAI5ahxkfe5QDVARxIpOr5sJACdi5n7naU',
  authDomain: 'invoice-app-f5b35.firebaseapp.com',
  projectId: 'invoice-app-f5b35',
  storageBucket: 'invoice-app-f5b35.appspot.com',
  messagingSenderId: '479714000929',
  appId: '1:479714000929:web:b40e94edbbd287a7c32360'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default getFirestore(app)

// import firebase from 'firebase/app'
// import 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: 'AIzaSyAI5ahxkfe5QDVARxIpOr5sJACdi5n7naU',
//   authDomain: 'invoice-app-f5b35.firebaseapp.com',
//   projectId: 'invoice-app-f5b35',
//   storageBucket: 'invoice-app-f5b35.appspot.com',
//   messagingSenderId: '479714000929',
//   appId: '1:479714000929:web:b40e94edbbd287a7c32360'
// }

// const firebaseApp = firebase.initializeApp(firebaseConfig)

// export default firebaseApp.firestore()
