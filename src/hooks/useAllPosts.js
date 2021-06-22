import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const useAllPosts = (collection) => {
   const [docs,setDocs] = useState([])
   
   useEffect(() => {
      const unsub = projectFirestore.collection(collection)
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
         })
         setDocs(results)
      })
      return (() => unsub())
   }, [collection])

   return {docs}
}
 
export default useAllPosts;