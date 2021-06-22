import { useState,useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectFirestore } from '../firebase/config';

const useCurrentUser = (collection) => {
   const {user} = useAuth()
   const [userCollection,setUserCollection] = useState([])

   useEffect(() => {
      if(user){
         const unsub = projectFirestore.collection(collection).doc(user.uid).onSnapshot(doc => {
            if(doc.data()){
               setUserCollection(doc.data())
            }
         })
         return () => unsub()
      }
   }, [collection])

   return {userCollection}
}
 
export default useCurrentUser;