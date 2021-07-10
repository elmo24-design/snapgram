import { Avatar } from "@material-ui/core";
import useAllUsers from "../hooks/useAllUsers";
import useComments from '../hooks/useComments';
import moment from 'moment';
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { projectFirestore } from "../firebase/config";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
   link:{
      color: 'black',
      cursor: 'pointer'
   }
}))

const CommentSection = ({selectedPost}) => {
   const {comments} = useComments('comments',selectedPost)
   const {usersCollection} = useAllUsers('users')
   const {user} = useAuth()
   const classes = useStyles()

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
                                             <Link to={`/user/${user.id}`} className={classes.link}>
                                                <Avatar src={user.profilePic}alt="avatar"/>
                                             </Link>
                                             <Link to={`/user/${user.id}`} className={classes.link}>
                                                <p className="username username-forum-window">{user.username}</p>
                                             </Link>
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