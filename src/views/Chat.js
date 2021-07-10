import React, {useEffect, useState} from 'react';
import HeaderChat from "../components/HeaderChat";
import { ChatEngine } from 'react-chat-engine';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useHistory } from 'react-router';


const Chat= () => {
   const {user} = useAuth()
   const history = useHistory()
   const [loading,setLoading] = useState(true)

   // const getFile = async(url) => {
   //    let blobPic = new Blob(url, {type: 'file'})

   //    return new File([blobPic], "userPhoto.jpg", { type: 'image/jpeg'})
   // } 

   useEffect(() => {
      if(!user){
         history.push('/')
         return;
      }
      axios.get(`https://api.chatengine.io/users/me`, {
         headers: {
            'project-id': process.env.REACT_APP_CHAT_ENGINE_ID,
            "user-name": user.email,
            "user-secret": user.uid
         }
      })
      .then(() => {
         setLoading(false)
      })
      .catch(() => {
         let formdata = new FormData()
         formdata.append('email', user.email)
         formdata.append('username', user.email)
         formdata.append('secret', user.uid)

         // formdata.append('avatar', userCollection.profilePic, 'userPhoto.jpg')

         axios.post("https://api.chatengine.io/users/", 
            formdata,
            { headers: {"private-key": process.env.REACT_APP_CHAT_ENGINE_KEY}}
         )
         .then(() => setLoading(false))
         .catch((err) => console.log(err))

         // getFile(userCollection.profilePic)
         // .then((avatar) => {
         //    formdata.append('avatar', avatar, avatar.name)

         //    axios.post("https://api.chatengine.io/users/", 
         //       formdata,
         //       { headers: {"private-key": process.env.REACT_APP_CHAT_ENGINE_KEY}}
         //    )
         //    .then(() => setLoading(false))
         //    .catch((err) => console.log(err))
         // })
      })
   },[user, history])

   return ( 
      <div>
         <HeaderChat />
         <div className="container chats-page">
            {
               user &&
               <ChatEngine 
                  height="calc(100vh - 66px)"
                  projectID="9c71766e-d433-4f0e-a8f0-f663b728e23a"
                  userName={user.email}
                  userSecret={user.uid}
                  className="chat-engine"
               />
            }
         </div>
      </div>
   );
}
 
export default Chat;