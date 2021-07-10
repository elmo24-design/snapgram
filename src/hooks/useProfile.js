import { useEffect,useState } from "react";
import { projectFirestore } from "../firebase/config";

const useProfile = (id) => {
   const [userData,setUser] = useState([])

   useEffect(() => {
      const unsub = projectFirestore.collection('users').doc(id)
      .onSnapshot(doc => {
         if(doc.data()){  
            setUser(doc.data())
         }
      })
      return () => unsub()
   
   }, [id])

   return {userData}
}
 
export default useProfile;