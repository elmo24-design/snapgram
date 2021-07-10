import { motion } from 'framer-motion';
import useAllUsers from '../hooks/useAllUsers';
import {Avatar, Divider} from '@material-ui/core';
import {Button} from '@material-ui/core';
import { Link } from 'react-router-dom';

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


const FollowingModal = ({targetUserFollowing,setTargetUserFollowing}) => {
   const {usersCollection} = useAllUsers('users')

   const closeModal = (e) => {
      if(e.target.classList.contains('likes-modal-backdrop')){
         setTargetUserFollowing(null)
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
            <h1>Following</h1>
            <Divider />
               {
                  targetUserFollowing.following.length !== 0 ?
                     <div>
                        {
                           usersCollection && usersCollection.map(user => (
                              <div key={user.id}>
                                 {
                                    targetUserFollowing.following && targetUserFollowing.following.includes(user.id) ? 
                                       <div className="inner-likes-modal">
                                          <div className="inner-likes-user">
                                             <Avatar src={user.profilePic}/>
                                             <span>{user.username}</span>
                                          </div>

                                          <Link to={`/user/${user.id}`}>
                                             <Button 
                                                variant="contained" 
                                                color="primary" 
                                                size="small"
                                             >
                                                View Profile
                                             </Button> 
                                          </Link>
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
                     No users being followed yet
                  </div>
               }
         </motion.div>
      </motion.div>
   );
}
 
export default FollowingModal;