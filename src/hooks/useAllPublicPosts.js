import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { projectFirestore } from "../firebase/config";

const useAllPublicPosts = (collection) => {
   const [docs,setDocs] = useState([])
   const {user} = useAuth()

   useEffect(() => {
      const unsub = projectFirestore.collection(collection)
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            if(doc.data().status === 'public' && doc.data().followers.includes(user.uid)){
               doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
            }
         })
         setDocs(results)
      })
      return (() => unsub())
   }, [collection])

   return {docs}
}
 
export default useAllPublicPosts;