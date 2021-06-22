import Header from "../components/Header";
import useAllUsers from "../hooks/useAllUsers";
import useNotif from '../hooks/useNotif';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles'
import NotifInner from "../components/NotifInner";
import { useState } from "react";
import ImageModal from "../components/ImageModal";
import { projectFirestore } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import {motion} from 'framer-motion';
import LikesModal from '../components/LikesModal';

const useStyles = makeStyles((theme) => ({
   cardUI:{
      marginBottom: '10px',
   },
}))

const Notifications = () => {
   const {usersCollection} = useAllUsers('users')
   const {notifCollection} = useNotif('notifications')
   const [selectedPost,setSelectedPost] = useState(null)
   const [likedPost,setLikedPost] = useState(null)
   const {user} = useAuth()
   const classes = useStyles()

   //like post
   const likePost = (doc,id) => {
      const newLike = user.uid 
      projectFirestore.collection('memories').doc(id).update({
         likes: [...doc.likes,newLike]
      })
   }
   //unlike post
   const unlikePost = (doc,id) => {
      const newLikes = doc.likes.filter(like => {
         return like !== user.uid
      })
      projectFirestore.collection('memories').doc(id).update({
         likes: [...newLikes]
      })
   }
   //delete notif
   const handleDelete = (doc) => {
      window.confirm('Are you sure you want to delete this notification?') &&
      projectFirestore.collection('notifications').doc(doc.id).delete()
   }
   //read
   const setAsRead = (notif) => {
      if(notif.className === 'card-notif-active'){
         projectFirestore.collection('notifications').doc(notif.id).update({
            className: 'card-notif'
         })
      }
   }
   //set as default
   const setAsDefault = (notif) => {
      if(notif.className === 'card-notif'){
         projectFirestore.collection('notifications').doc(notif.id).update({
            className: 'card-notif-active'
         })
      }
   }

   return ( 
      <div>
          {
            likedPost && 
            <LikesModal 
               likedPost={likedPost}
               setLikedPost={setLikedPost}
            />
         }
         {
            selectedPost && 
            <ImageModal selectedPost={selectedPost} 
               setSelectedPost={setSelectedPost}
               likedPost={likedPost}
               setLikedPost={setLikedPost}
               likePost={likePost}
               unlikePost={unlikePost} 
            />
         }
         <Header />
         <div className="inner-container notif">
            <h2>Your Notifications...</h2>
            {
               notifCollection.length !== 0 ?
               <div>
                  {
                     notifCollection && notifCollection.map(notif => (
                        <motion.div key={notif.id} layout>
                           <Card className={classes.cardUI}>
                              <div className={notif.className} id="card-notif">
                                 {
                                    usersCollection && usersCollection.map(user => (
                                       <div key={user.id}>
                                          {
                                             notif.ownerId === user.id ? 
                                             <NotifInner user={user} notif={notif} setSelectedPost={setSelectedPost}/>
                                             :
                                             null
                                          }
                                       </div>
                                    ))
                                 }
                                 {
                                    notif.className === 'card-notif-active' ?
                                    <i class="far fa-square" id="square-icon" onClick={() => setAsRead(notif)}></i>
                                    :
                                    <i class="far fa-check-square" id="check-icon" onClick={() => setAsDefault(notif)}></i>
                                 }
                                 <i class="fas fa-trash" id="trash-icon-notif" onClick={() => handleDelete(notif)}></i>
                              </div>
                           </Card>
                        </motion.div>
                     ))
                  }
               </div>
               :
               <div>
                  You have no notifications yet
               </div>
            }
         </div>
      </div>
   );
}
 
export default Notifications;