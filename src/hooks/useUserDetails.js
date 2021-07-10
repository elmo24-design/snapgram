import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const useUserDetails = (id) => {
   const [selectedUser,setSelectedUser] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection('users')
      .orderBy('createdAt','desc')
      .onSnapshot(snap => {
         snap.docs.forEach(doc => {
            if(doc.id === id){
               setSelectedUser(doc.data())
            }
         })
      })
      return () => unsub()
   }, [id])

   return {selectedUser}

}
 
export default useUserDetails;