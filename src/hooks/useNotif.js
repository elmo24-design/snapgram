import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { projectFirestore } from "../firebase/config";

const useNotif = (collection) => {
   const [notifCollection,setNotifCollection] = useState([])
   const {user} = useAuth()

   useEffect(() => {
      if(user){
         const unsub = projectFirestore.collection(collection)
         .orderBy('createdAt','desc')
         .onSnapshot(snap => {
            let results = [] 
            snap.docs.forEach(doc => {
               if(doc.data().targetId === user.uid){
                  doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
               }
            })
            setNotifCollection(results)
         })
         return (() => unsub())
      }
   }, [collection])

   return {notifCollection}
}
 
export default useNotif;