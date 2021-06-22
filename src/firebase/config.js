import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
   apiKey: "AIzaSyAjzovs9Y7n4Y01uKfiGhiAlxETRJ5NizU",
   authDomain: "project-planner-7785f.firebaseapp.com",
   projectId: "project-planner-7785f",
   storageBucket: "project-planner-7785f.appspot.com",
   messagingSenderId: "537056066700",
   appId: "1:537056066700:web:382bd70bf18d9ce66c0fa9"
};

//init firebase
firebase.initializeApp(firebaseConfig)

const projectAuth = firebase.auth()
const projectFirestore = firebase.firestore()
const projectStorage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectAuth, projectFirestore, projectStorage, timestamp }