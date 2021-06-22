import { motion } from 'framer-motion';
import { useState } from 'react';
import ForumWindow from './ForumWindow';
import EditPostModal from './EditPostModal';

const backdropVariants = {
   hidden:{
      opacity: 0
   },
   visible: {
      opacity: 1
   }
}
const imgVariants = {
   hidden: {
      y: "-100vh"
   },
   visible:{
      y: 0
   }
}

const ImageModal = ({selectedPost,setSelectedPost,likePost,unlikePost,likedPost,setLikedPost,singleUser}) => {

   const [editModal,setEditPostModal] = useState(false)

   const handleClick = (e) => {
      if(e.target.classList.contains("backdrop") || e.target.classList.contains("backdrop-img") || e.target.classList.contains("grid-1")){
         setSelectedPost(null)
      }
   }
   return (
      <div>
         {
            editModal && 
            <EditPostModal selectedPost={selectedPost} setSelectedPost={setSelectedPost} setEditPostModal={setEditPostModal}/>
         }
         <motion.div className="backdrop bg-img"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            onClick={handleClick}
            >
            <div className="backdrop-img">
               <i class="fas fa-times" id="close" onClick={() => setSelectedPost(null)}></i>
               <div className="grid-1">
                  <motion.img src={selectedPost.backgroundUrl} alt="enlarged-pic" 
                     variants={imgVariants} className="modal-img"
                  />
               </div>
               <ForumWindow 
                  selectedPost={selectedPost} 
                  setSelectedPost={setSelectedPost}
                  setEditPostModal={setEditPostModal}
                  likePost={likePost}
                  unlikePost={unlikePost}
                  likedPost={likedPost}
                  setLikedPost={setLikedPost}
                  singleUser={singleUser}
               />
            </div>
         </motion.div>
      </div>
   );
}
 
export default ImageModal;