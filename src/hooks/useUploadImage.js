import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectStorage, projectFirestore } from '../firebase/config';

const useUploadImage = (file) => {
   //user creds
   const {user} = useAuth()

   //progress states
   const [progress,setProgress] = useState(0)
   const [error, setError] = useState(null)
   const [url, setUrl] = useState(null)

   useEffect(() => {
      let filePath = `covers/profile/${file.name}`
      let storageRef = projectStorage.ref(filePath)

      storageRef.put(file).on('state_changed', (snap) => {
         let percentage = (snap.bytesTransferred / snap.totalBytes) * 100
         setProgress(percentage)
      }, (err) => {
         setError(err)
      }, async() => {
         const url = await storageRef.getDownloadURL()
         await projectFirestore.collection('users').doc(user.uid).update({
            profilePic: url
         })      
       
         setUrl(url)
      })
   }, [file, user])

   return { progress, url, error }

}
 
export default useUploadImage;