import { motion } from 'framer-motion';
import useAllUsers from '../hooks/useAllUsers';
import {Avatar, Divider} from '@material-ui/core';

const backdrop = {
   hidden: {
      opacity: 0,
   },
   visible: {
      opacity: 1
   }
}
const modal = {
   hidden: {
      y: "-100vh",
      opacity: 0
   },
   visible: {
      y: '100px',
      opacity: 1,
      transition: {
         delay: 0.2
      }
   }
}


const LikesModal = ({setLikedPost,likedPost}) => {
   const {usersCollection} = useAllUsers('users')

   const closeModal = (e) => {
      if(e.target.classList.contains('likes-modal-backdrop')){
         setLikedPost(null)
      }
   }
   return ( 
      <motion.div className="backdrop likes-modal-backdrop"
         variants={backdrop}
         initial="hidden"
         animate="visible"
         exit="hidden"
         onClick={closeModal}
      >
         <motion.div className="modal likes-modal" variants={modal}>
            <h1>Liked by</h1>
            <Divider />
            {
               likedPost.likes.length !== 0 ?
                  <div>
                     {
                        usersCollection && usersCollection.map(user => (
                           <div key={user.id}>
                              {
                                 likedPost.likes.includes(user.id) ? 
                                    <div className="inner-likes-modal">
                                       <div className="inner-likes-user">
                                          <Avatar src={user.profilePic}/>
                                          <span>{user.username}</span>
                                          <i class="fas fa-heart" id="heart-likes-modal"></i>
                                       </div>
                                    <p>View Profile</p>
                                    </div>
                                 : 
                                 ''
                              }    
                           </div>
                        ))
                     }
                  </div>
               :
                  <div className="not-yet">
                     This post has no likes yet
                  </div>
            }
         </motion.div>
      </motion.div>
   );
}
 
export default LikesModal;