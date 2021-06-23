import React, { useState } from 'react';
import {Avatar, Button, Divider} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';
import useCurrentUser from '../hooks/useCurrentUser';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import EditModal from '../components/profile/EditModal';
import EditInfo from '../components/profile/EditInfo';
import ChangePassword from '../components/profile/ChangePassword';
import UploadImage from '../components/profile/UploadImage';
import Header from '../components/Header';
import AddModal from '../components/AddModal';
import ImageGridProfile from '../components/profile/ImageGridProfile';
import ImageModal from '../components/ImageModal';
import LikesModal from '../components/LikesModal';
import FollowersModal from '../components/FollowersModal';
import FollowingModal from '../components/FollowingModal';
import { projectFirestore } from '../firebase/config';
import useOwnedPosts from '../hooks/useOwnedPosts';

const useStyles = makeStyles((theme) => ({
   big: {
      width: theme.spacing(22),
      height: theme.spacing(22),
      marginTop: '30px'
   },
   add: {
      color: 'white',
   },
   addEllipse: {
      position: 'absolute',
      right: '0',
      bottom: '0',
      marginRight: '10px',
      width: theme.spacing(6),
      height: theme.spacing(6),
   },
   edit: {
      marginLeft: '3rem',
      width: theme.spacing(6),
      height: theme.spacing(6),
   },
   followersLength:{
      marginLeft: '1.3rem',
   }
}))

const Profile = () => {
   const classes= useStyles();
   const {user,updateEmail} = useAuth()
   const {userCollection} = useCurrentUser('users')
   const {docs} = useOwnedPosts('memories')

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

   //modals
   const [editModal, setEditModal]= useState(false)
   const [editInfo, setEditInfo] = useState(false)
   const [changePassword,setChangePassword] = useState(false)
   const [addModal,setAddModal] = useState(false)
   const [selectedPost,setSelectedPost] = useState(null)
   const [likedPost,setLikedPost] = useState(null)
   const [targetUserFollowers,setTargetUserFollowers] = useState(null)
   const [targetUserFollowing,setTargetUserFollowing] = useState(null)

   return (
      <div>
         {
            targetUserFollowing && 
            <FollowingModal 
               targetUserFollowing={userCollection}
               setTargetUserFollowing={setTargetUserFollowing}
            />
         }
         {
            targetUserFollowers && 
            <FollowersModal 
               targetUserFollowers={targetUserFollowers}
               setTargetUserFollowers={setTargetUserFollowers}
            />
         }
         {
            likedPost && 
            <LikesModal 
               likedPost={likedPost}
               setLikedPost={setLikedPost}
            />
         }
         {
            selectedPost && (
               <ImageModal selectedPost={selectedPost} setSelectedPost={setSelectedPost}
                  likePost={likePost}
                  unlikePost={unlikePost}
                  likedPost={likedPost}
                  setLikedPost={setLikedPost}
               />
            )
         }
         {
            addModal && (
               <AddModal setAddModal={setAddModal}/>
            )
         }
         {
            changePassword && (
               <ChangePassword 
                  setChangePassword={setChangePassword}
               />
            )
         }
         {
            editInfo && (
               <EditInfo 
                  setEditInfo={setEditInfo}
                  user={user}
                  updateEmail={updateEmail}
                  userCollection={userCollection}
                  />
            )
         }
         {
            editModal && (
               <EditModal 
                  setChangePassword={setChangePassword}
                  setEditModal={setEditModal} 
                  setEditInfo={setEditInfo}/> 
            )
         }
         <Header />
         <div class="inner-container profile">
            <div className="profile-heading">
               <div>
                  {
                     userCollection.profilePic ?
                     <Avatar 
                        src={userCollection.profilePic} 
                        className={classes.big}
                     /> 
                     : 
                     <Avatar 
                        className={classes.big}
                     />
                  }
                  {/* <Fab color="secondary" aria-label="add" className={classes.addEllipse}>
                     <AddIcon className={classes.add}/>
                  </Fab> */}
                  <UploadImage/>
               </div>
               <div className="aside">
                  <div className="user-bio">
                     <div>
                        <h1>{userCollection.username}</h1>
                        {
                           userCollection.bio && 
                           <h4>{userCollection.bio}</h4>
                        }
                       
                     </div>
                     <Fab aria-label="edit" className={classes.edit} onClick={() => setEditModal(true)}>
                        <EditIcon />
                     </Fab>
                  </div>
                  <div className="social">
                     <h3>
                        {
                           docs &&
                           <span>
                           { docs.length }
                           </span>
                        }
                        {
                           docs && docs.length === 1 ?
                              `post`
                           : 
                              `posts`
                        }
                     </h3>
                     <h3 className="followersOfUser" onClick={() => setTargetUserFollowers(userCollection)}>
                        {
                           userCollection.followers &&
                           <span>
                           { userCollection.followers.length}
                           </span>
                        }
                        {
                           userCollection.followers && userCollection.followers.length === 1 ?
                              <div className={classes.followersLength}>
                                 follower
                              </div>
                           : 
                              <div className={classes.followersLength}>
                                 followers
                              </div>
                        }
                     </h3>
                     <h3 className="followersOfUser" onClick={() => setTargetUserFollowing(userCollection)}>
                        {
                           userCollection.following &&
                           <span>
                           { userCollection.following.length}
                           </span>
                        }
                        following
                     </h3>
                  </div>
                  {
                     user && <p>@{user.email}</p>
                  }
                  {
                     userCollection.website && 
                     <small>Personal Website: <a href={userCollection.website} className="user-link" target="_blank">{userCollection.website}</a></small>
                  }
               </div>
            </div>
            <Divider />
            <div>
               <ImageGridProfile setAddModal={setAddModal} setSelectedPost={setSelectedPost}/> 
            </div>
         </div>
      </div>
   );
}
 
export default Profile;