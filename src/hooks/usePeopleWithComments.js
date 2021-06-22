import { useState,useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const usePeopleWithComments = (comment) => {
   const [users,setUsers] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection('users')
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            if(doc.data().id === comment.ownerId){
               doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
            }
         })
         setUsers(results)
      })

      return (() => unsub())
   }, [comment])

   return {users}
}
 
export default usePeopleWithComments;