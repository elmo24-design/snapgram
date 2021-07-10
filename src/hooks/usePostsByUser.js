import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const usePostsByUser = (id) => {
   const [userDocs,setDocs] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection('memories')
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            if(doc.data().userId === id){
               doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
            }
         })
         setDocs(results)
      })
      return (() => unsub())
   }, [id])

   return {userDocs}
}
 
export default usePostsByUser;