import { Avatar } from "@material-ui/core";
import useAllPosts from "../hooks/useAllPosts";
import useAllUsers from "../hooks/useAllUsers";
import useComments from '../hooks/useComments';
import moment from 'moment';
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { projectFirestore } from "../firebase/config";

const CommentSection = ({selectedPost}) => {
   const {comments} = useComments('comments',selectedPost)
   const {docs} = useAllPosts('memories') 
   const {usersCollection} = useAllUsers('users')
   const {user} = useAuth()

   const deleteComment = async(comment,commentId,docId) => {
     window.confirm('Are you sure you want to delete this comment?') &&
     await projectFirestore.collection('comments').doc(comment.id).delete()
     .then(() => {
         const newComment = selectedPost.comments.filter(comment => {
            return comment !== commentId
         })
         projectFirestore.collection('memories').doc(docId).update({
            comments: [ ...newComment]
         })
     })
     .catch((err) => console.log(err))
   }

   return ( 
      <div className="comment-section">
         {
            comments.length !== 0 ?
            <div>
               {
                  comments && comments.map(comment => (
                     <div key={comment.id}>
                        <motion.div className="heading2" layout>
                           <div className="inner">
                              {
                                 usersCollection && usersCollection.map(user =>(
                                    <div key={user.id}>
                                       {
                                          user.id === comment.ownerId ?
                                          <div className="comment-user-details"> 
                                             <Avatar src={user.profilePic}alt="avatar"/>
                                             <p className="username">{user.username}</p>
                                          </div>
                                          :
                                          ''
                                       }
                                    </div>
                                 ))
                              }
                              <small className="createdAtComment">
                              {
                                 moment(comment.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a')
                              }
                              </small>
                           </div>
                           <div className="desc">{comment.comment}</div>
                           {
                              comment.ownerId === user.uid ?
                                 <i class="fas fa-trash" id="delete-comment" 
                                 onClick={() => deleteComment(comment,comment.commentId,selectedPost.id)}
                                 >
                                 </i>
                              :
                                 ''
                           }                                        
                        </motion.div>      
                     </div>       
                  ))
               } 
            </div>
            :
            <div>No comments here yet</div>
         }
      </div>
   );
}
 
export default CommentSection;