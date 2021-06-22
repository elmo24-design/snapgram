import { useEffect,useState } from "react";
import { projectFirestore } from "../firebase/config";

const useSingleUser = (collection,id) => {
   const [singleUser,setSingleUser] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection(collection).doc(id)
      .onSnapshot(doc => {
         if(doc.data()){  
            setSingleUser(doc.data())
         }
      })
      return () => unsub()
   
   }, [id])

   return {singleUser}
}
 
export default useSingleUser;