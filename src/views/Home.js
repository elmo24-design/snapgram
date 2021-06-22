import { useState, useEffect } from "react";
import Header from "../components/Header";
import ImageGridHome from "../components/ImageGridHome";
import AddModal from '../components/AddModal';
import ImageModal from "../components/ImageModal";
import LikesModal from '../components/LikesModal';
import { useAuth } from "../contexts/AuthContext";
import { projectFirestore,timestamp } from "../firebase/config";

const Home = () => {
   const [addModal,setAddModal] = useState(false)
   const [selectedPost,setSelectedPost] = useState(null)
   const {user} = useAuth()
   const [singleUser,setSingleUser] = useState([])
   const [likedPost,setLikedPost] = useState(null)

   useEffect(() => {
      if(selectedPost){
         const unsub = projectFirestore.collection('users').doc(selectedPost.userId)
         .onSnapshot(doc => {
            if(doc.data()){  
               setSingleUser(doc.data())
               console.log(doc.data().notifications)
            }
         })
         return () => unsub()
      }
   }, [selectedPost])

   //like post
   const likePost = async(doc,id) => {
      const newLike = user.uid 
      const notifId = Math.floor(Math.random() * 1000000)
      await projectFirestore.collection('memories').doc(id).update({
         likes: [...doc.likes,newLike]
      })
      if(doc.userId !== user.uid ){
         await projectFirestore.collection('notifications').add({
            body: 'liked your post',
            ownerId: user.uid,
            targetId: doc.userId,
            postId: doc.id,
            notifId: notifId,
            className: 'card-notif-active',
            createdAt: timestamp()
         })
         await projectFirestore.collection('users').doc(doc.userId).update({
            notifications: [ ...singleUser.notifications, notifId]
         })
      }
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
            <ImageModal 
               selectedPost={selectedPost} 
               setSelectedPost={setSelectedPost}
               likedPost={likedPost}
               setLikedPost={setLikedPost}
               likePost={likePost}
               unlikePost={unlikePost}
               singleUser={singleUser}
            />
         }
         {
            addModal && 
               <AddModal setAddModal={setAddModal}/>
         }
         <Header setAddModal={setAddModal}/>
         <div className="inner-container home">
            <h4>Your News Feed...</h4>
            <div>
               <ImageGridHome 
                  selectedPost={selectedPost} 
                  setSelectedPost={setSelectedPost} 
                  setLikedPost={setLikedPost}
                  likePost={likePost}
                  unlikePost={unlikePost}
               />
            </div>
         </div>
      </div>
   );
   
}
 
export default Home;