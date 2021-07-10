import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { projectFirestore } from "../firebase/config";

const useOwnedPosts = (collection) => {
   const [docs,setDocs] = useState([])
   const {user} = useAuth()

   useEffect(() => {
      if(user){
         const unsub = projectFirestore.collection(collection)
         .orderBy('createdAt','desc')
         .onSnapshot(snap => {
            let results = []
            snap.docs.forEach(doc => {
               if(doc.data().userId === user.uid){
                  doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
               }
            })
            setDocs(results)
         })
         return (() => unsub())
      }
   }, [collection, user])

   return {docs}
}
 
export default useOwnedPosts;