import { useEffect, useState  } from "react";
import { projectFirestore } from "../firebase/config";

const useComments = (collection,selectedPost) => {
   const [comments,setComments] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection(collection)
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => 
         {
            if(doc.data().postId === selectedPost.id){
               doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
            }
         })
         setComments(results)
      })
      return (() => unsub())
      
   }, [collection])

   return {comments}
}
 
export default useComments;