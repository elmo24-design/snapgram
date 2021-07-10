import React, { useState } from 'react';
import {Avatar, Button, Divider} from '@material-ui/core';
import Header from "../components/Header";
import { useHistory, useParams } from 'react-router';
import useProfile from '../hooks/useProfile';
import usePostsByUser from '../hooks/usePostsByUser';
import { useAuth } from '../contexts/AuthContext';
import { makeStyles } from '@material-ui/core/styles';
import useAllPosts from '../hooks/useAllPosts';
import { projectFirestore, timestamp } from '../firebase/config';
import useCurrentUser from '../hooks/useCurrentUser';
import FollowingModal from '../components/FollowingModal';
import FollowersModal from '../components/FollowersModal';
import ImageGridProfile from '../components/profile/ImageGridProfile';
import ImageModal from '../components/ImageModal';
import LikesModal from '../components/LikesModal';

const useStyles = makeStyles((theme) => ({
   big: {
      width: theme.spacing(15),
      height: theme.spacing(15),
      marginTop: '30px'
   },
}))

const UserProfile = () => {
   const classes = useStyles()
   const history = useHistory()

   const { id } = useParams()
   const {userData} = useProfile(id)
   const {user} = useAuth()

   const {userCollection} = useCurrentUser('users') //current user's details
   const {userDocs} = usePostsByUser(id) //posts by the viewed user
   const {docs} = useAllPosts('memories') // all posts

   const [targetUserFollowers,setTargetUserFollowers] = useState(null)
   const [targetUserFollowing,setTargetUserFollowing] = useState(null)

   const [selectedPost,setSelectedPost] = useState(null)
   const [likedPost,setLikedPost] = useState(null)

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
            notifications: [ ...userData.notifications, notifId]
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

   //follow and unfollow
   const followUser = () => {
      projectFirestore.collection('users').doc(id).update({
         followers: [...userData.followers, user.uid]
      }).then(() => {
         projectFirestore.collection('users').doc(user.uid).update({
            following: [...userCollection.following, id]
         })
      }).then(() =>{
         const notifId = Math.floor(Math.random() * 1000000)
         projectFirestore.collection('notifications').add({
            body: 'followed you',
            ownerId: user.uid,
            targetId: id,
            notifId: notifId,
            className: 'card-notif-active',
            createdAt: timestamp()
         })
         projectFirestore.collection('users').doc(id).update({
            notifications: [ ...userData.notifications, notifId]
         })
      }).then(() => {
         docs.map(doc => {
            if(doc.userId === id){
               projectFirestore.collection('memories').doc(doc.id).update({
                  followers: [ ...doc.followers, user.uid]
               })
            }
         })
      })
      .catch(err => console.log(err))
   }
   
   const unfollowUser = () => {
      const newFollowers = userData.followers.filter(userId => {
         return userId !== user.uid 
      })
      const newFollowing = userCollection.following.filter(userId => {
         return userId !== id  
      })
      projectFirestore.collection('users').doc(id).update({
         followers: [ ...newFollowers]
      }).then(() => {
         projectFirestore.collection('users').doc(user.uid).update({
            following: [ ...newFollowing]
         })
      }).then(() => {
         docs.map(doc => {
            if(doc.userId === id){
               const newPostFollowers = doc.followers.filter(userId => {
                  return userId !== user.uid
               })
               projectFirestore.collection('memories').doc(doc.id).update({
                  followers: [ ...newPostFollowers ]
               })
            }
         })
      }).catch(err => console.log(err))
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
            selectedPost && (
               <ImageModal selectedPost={selectedPost} setSelectedPost={setSelectedPost}
                  likePost={likePost}
                  unlikePost={unlikePost}
                  likedPost={likedPost}
                  setLikedPost={setLikedPost}
                  singleUser={userData}
               />
            )
         }
         {
            targetUserFollowing && 
            <FollowingModal 
               targetUserFollowing={targetUserFollowing}
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
         <Header />
         <div className="inner-container user-profile">
            <i class="fas fa-arrow-left" id="back"
            onClick={() => history.goBack()}
            ></i>
            <div className="user-profile-heading">
               <Avatar src={userData.profilePic} className={classes.big}/>
               {/* Right column in heading */}
               <div className="user-profile-right">
                  {/* Right 1 */}
                  <div className="right-1">
                     <div className="user-profile-username">
                        {
                           user &&  <h2>{userData.username}</h2> 
                        }
                        {
                           user && userData.following && userData.following.includes(user.uid) ?
                              <small>Follows you</small>
                           :
                           ''
                        }
                     </div>
                     {
                        userData.bio &&
                        <h3 className="user-profile-bio">{userData.bio}</h3>
                     }
                     {/* social data */}
                     <div className="user-profile-social">
                        <p>
                           <span>{userDocs.length && userDocs.length}</span>
                           <span>
                           {
                              userDocs && userDocs.length === 1 ?
                              `post`
                              :
                              `posts`
                           }
                           </span>
                        </p>
                        <p onClick={() => setTargetUserFollowers(userData)}>
                           <span>{userData.followers && userData.followers.length}</span>
                           <span>
                           {
                              userData.followers && userData.followers.length === 1 ? 
                              `follower`
                              :
                              `followers`
                           }
                           </span>
                        </p>
                        <p onClick={() => setTargetUserFollowing(userData)}>
                           <span>{userData.following && userData.following.length}</span>
                           <span>
                              following
                           </span>
                        </p>
                     </div>
                     {/* end-social-data */}
           
                     {
                        userData.website &&
                        <p className="user-profile-website">Personal Website: <a href={`${userData.website}`} target="_blank">{userData.website}</a></p>
                     }

                  </div>
                  {/* right-2 */}
                  {
                     user && id !== user.uid ?
                        <div className="right-2">
                        {
                           user && userData.followers && userData.followers.includes(user.uid) ?
                           <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={unfollowUser}
                              >
                              Following
                           </Button>
                           :
                           <Button 
                              variant="outlined" 
                              color="primary" 
                              size="small"
                              onClick={followUser}
                              >
                              Follow
                           </Button>
                        }
                     </div>
                     :
                     ''
                  }
               </div>
            </div>
            <Divider />
            <div>
               <h4>{`${userData.username}'s Memories...`}</h4>
               <ImageGridProfile setSelectedPost={setSelectedPost} docs={userDocs}/> 
            </div>
            
         </div>
      </div>
   );
}
 
export default UserProfile;