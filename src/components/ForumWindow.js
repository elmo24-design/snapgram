import { motion } from 'framer-motion';
import {Avatar, Divider, Button} from "@material-ui/core";
import useUserDetails from '../hooks/useUserDetails';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import { useAuth } from '../contexts/AuthContext';
import useAllPosts from '../hooks/useAllPosts';
import { projectFirestore, projectStorage, timestamp } from '../firebase/config';
import CommentSection from './CommentSection';
import useComments from '../hooks/useComments';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
   list: { 
      width: '5rem',
      backgroundColor: theme.palette.background.paper,
   },
   center:{
      textAlign: 'center'
   },
   field:{
      marginTop: '1rem'
   },
   btn:{
      marginTop: '1rem'
   },
   icon:{
      fontSize: '1rem'
   },
   link:{
      color: 'black',
      cursor: 'pointer'
   }
}))

const forumVariants = {
   hidden: {
      y: "-100vh"
   },
   visible:{
      y: 0
   }
}

const ForumWindow = ({selectedPost,setSelectedPost,likePost,unlikePost,likedPost,setLikedPost,singleUser,setEditPostModal}) => {
   const {comments} = useComments('comments',selectedPost)
   const {selectedUser} = useUserDetails(selectedPost.userId)
   const [anchorEl, setAnchorEl] = useState(null)
   const classes = useStyles()
   const [formattedDate,setFormattedDate] = useState(null)
   const {user} = useAuth()
   const {docs} = useAllPosts('memories')
   const [isPending,setIsPending] = useState(false)
   
   //comment state
   const [comment,setComment] = useState(null)
  

   useEffect(() => {
      setFormattedDate(moment(selectedPost.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a'))
   }, [selectedPost])

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;

   //function for delete
   const handleDelete = () => {
      window.confirm('are you sure you want to delete this post?') &&
      projectFirestore.collection('memories').doc(selectedPost.id).delete()
      .then(() => {
         projectStorage.ref(selectedPost.filePath).delete()
      })
      .then(() => {
         comments.map(comment => {
            projectFirestore.collection('comments').doc(comment.id).delete()
         })
      })
      setSelectedPost(null)
   }

   //function to add a comment
   const commentPost = async(e) => {
      e.preventDefault()
      setIsPending(true)
      const commentId = Math.floor(Math.random() * 1000000)
      await projectFirestore.collection('comments').add({
         comment: comment,
         ownerId: user.uid, //the user
         postId: selectedPost.id, //the selected post
         createdAt: timestamp(),
      })
      if(selectedPost.userId !== user.uid ){
         await projectFirestore.collection('notifications').add({
            body: 'commented on your post',
            ownerId: user.uid,
            targetId: selectedPost.userId,
            postId: selectedPost.id,
            notifId: commentId,
            className: 'card-notif-active',
            createdAt: timestamp()
         })
         await projectFirestore.collection('users').doc(selectedPost.userId).update({
            notifications: [ ...singleUser.notifications, commentId]
         })
      }
      setIsPending(false)
      setComment('')
   }

   return (
      <motion.div className="forum-window" variants={forumVariants}>
         <div className="heading">
            <Link to={`/user/${selectedPost.userId}`} className={classes.link}>
               <div>
                  <Avatar src={selectedUser.profilePic} alt="avatar"/>
                  <p className="username-forum-window">{selectedUser.username}</p>
               </div>
            </Link>
            {
               selectedPost.userId === user.uid ? 
                  <i class="fas fa-ellipsis-h" 
                     id="ellipsis" 
                     onClick={handleClick} 
                     aria-describedby={id}
                  ></i>
               : ''
            }
            <Popover
               id={id}
               open={open}
               anchorEl={anchorEl}
               onClose={handleClose}
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
               }}
               transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
               }} 
               >
               <List className={classes.list} aria-label="mailbox folders">
                  <ListItem button divider onClick={() => setEditPostModal(true)}>
                     <ListItemText primary="Edit" className={classes.center}/>
                  </ListItem>
                  <ListItem button onClick={handleDelete}>
                     <ListItemText primary="Delete" className={classes.center}/>
                  </ListItem>
               </List>
            </Popover>
         </div>
         <Divider />
         <div className="heading2">
            <div className="inner">
               <Link to={`/user/${selectedPost.userId}`} className={classes.link}>
                  <Avatar src={selectedUser.profilePic} alt="avatar"/>
               </Link>
               <Link to={`/user/${selectedPost.userId}`} className={classes.link}>
                  <p className="username username-forum-window">{selectedUser.username}</p>
               </Link>
               <small className="status">({selectedPost.status})</small>
            </div>
            <div className="desc">{selectedPost.description}</div>
            <div className="createdAt">{formattedDate}</div>
         </div>
         <Divider />
         <div className="comment-heading">
            <i class="fas fa-comments"></i>
            <span>Comments</span>
         </div>
         <CommentSection selectedPost={selectedPost}/>
         <div className="bottom-container">
            <div className="dummy"></div>
            <div className="bottom">
               <div className="icons-comment">
               {
                  docs && docs.map(doc => (
                        <div key={doc.id}>
                           {
                              doc.id === selectedPost.id ? 
                                 <div>
                                    { user && doc.likes.includes(user.uid) ? 
                                       <i class="fas fa-heart" id="liked" onClick={() => unlikePost(doc,doc.id)}></i>
                                       :
                                       <i class="far fa-heart" onClick={() => likePost(doc,doc.id)}></i>
                                    }
                                    <small className="forum-window-likes-length"
                                    onClick={() => setLikedPost(doc)}
                                    >
                                       {doc.likes.length} 
                                       {
                                          doc.likes.length > 1 ?
                                          <span> likes</span>
                                          : doc.likes.length === 1 ?
                                          <span> like</span>
                                          :
                                          null
                                       }
                                    </small>
                                    <i class="far fa-comment" id="comment-icon"></i>
                                    <small>
                                       {comments.length} 
                                       {
                                          comments.length > 1 ?
                                          <span> comments</span>
                                          : comments.length === 1 ?
                                          <span> comment</span>
                                          :
                                          null
                                       }
                                    </small>
                                 </div>
                              :
                              ''
                           }
                        </div>
                  ))
               }
               </div>
               <form autoComplete="off" className="comment-form" onSubmit={commentPost}>
                  <TextField
                     id="standard-multiline-flexible"
                     label="Add a comment..."
                     className={classes.field}
                     multiline
                     rowsMax={4}
                     fullWidth
                     required
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                  />
                  {
                     comment && isPending === false ? 
                     <Button type="submit" variant="contained" color="primary" className={classes.btn}>
                        <SendIcon className={classes.icon}/>
                     </Button>
                     :
                     <Button type="submit" disabled variant="contained" color="primary" className={classes.btn}>
                        <SendIcon className={classes.icon}/>
                     </Button>
                  }
               </form>
            </div>
         </div>
      </motion.div>
   );
}
 
export default ForumWindow;