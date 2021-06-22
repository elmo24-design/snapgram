import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const useAllUsers = (collection) => {
   const [usersCollection,setUsers] = useState([])
   
   useEffect(() => {
      const unsub = projectFirestore.collection(collection)
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
         })
         setUsers(results)
      })
      return (() => unsub())
   }, [collection])

   return {usersCollection}
}
 
export default useAllUsers;