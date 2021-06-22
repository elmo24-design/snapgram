import { useEffect,useState } from "react";
import { projectFirestore } from "../firebase/config";

const useSingleDoc = (id) => {
   const [doc,setDoc] = useState([])
   const [likesArray,setLikesArray] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection('memories').doc(id)
      .onSnapshot(doc => {
         if(doc.data()){
            setDoc(doc.data())
            let tagSet = new Set 
            doc.data().likes.forEach(like => {
               tagSet.add(like)
            })
            setLikesArray([...tagSet])
         }
      })
     
      return () => unsub()
   }, [id])

   return {doc,likesArray}
}
 
export default useSingleDoc;