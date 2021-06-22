import Header from "../components/Header";
import TextField from '@material-ui/core/TextField';
import {Avatar, Divider, Button} from '@material-ui/core';
import useAllUsers from "../hooks/useAllUsers";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import { projectFirestore, timestamp } from "../firebase/config";
import useAllPosts from "../hooks/useAllPosts";

const People = () => {
   const {usersCollection} = useAllUsers('users') // all users
   const {userCollection} = useCurrentUser('users') //current user's details
   const {user} = useAuth() // current user firebase details
   const {docs} = useAllPosts('memories') // all posts

   const [searchText,setSearchText] = useState('')
   
   const followUser = (singleUser) => {
      projectFirestore.collection('users').doc(singleUser.id).update({
         followers: [...singleUser.followers, user.uid]
      }).then(() => {
         projectFirestore.collection('users').doc(user.uid).update({
            following: [...userCollection.following, singleUser.id]
         })
      }).then(() =>{
         const notifId = Math.floor(Math.random() * 1000000)
         projectFirestore.collection('notifications').add({
            body: 'followed you',
            ownerId: user.uid,
            targetId: singleUser.id,
            notifId: notifId,
            className: 'card-notif-active',
            createdAt: timestamp()
         })
         projectFirestore.collection('users').doc(singleUser.id).update({
            notifications: [ ...singleUser.notifications, notifId]
         })
      }).then(() => {
         docs.map(doc => {
            if(doc.userId === singleUser.id){
               projectFirestore.collection('memories').doc(doc.id).update({
                  followers: [ ...doc.followers, user.uid]
               })
            }
         })
      })
      .catch(err => console.log(err))
   }
   
   const unfollowUser = (singleUser) => {
      const newFollowers = singleUser.followers.filter(userId => {
         return userId !== user.uid 
      })
      const newFollowing = userCollection.following.filter(userId => {
         return userId !== singleUser.id  
      })
      projectFirestore.collection('users').doc(singleUser.id).update({
         followers: [ ...newFollowers]
      }).then(() => {
         projectFirestore.collection('users').doc(user.uid).update({
            following: [ ...newFollowing]
         })
      }).then(() => {
         docs.map(doc => {
            if(doc.userId === singleUser.id){
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
         <Header />
         <div className="inner-container people">
            <div className="heading-people">
               <h2>People</h2>
               <form id="search-people">
                  <TextField label="Search here..." type="search"
                     value={searchText}
                     onChange={(e) => setSearchText(e.target.value.toLowerCase())}
                  />                 
               </form>
            </div>
            <Divider />
            <div className="users-list">
               {
                  usersCollection && usersCollection.map(singleUser => (
                     <div key={singleUser.id}>
                        {
                           user && singleUser.id !== user.uid ? 
                              <div>
                                 {
                                    singleUser.username.toLowerCase().indexOf(searchText) !== -1 ?
                                       <div className="inner-list-wrapper">
                                          <div className="inner-list">
                                             <div className="user-details-people">
                                                <Avatar src={singleUser.profilePic} alt="user"/>
                                                <span>{singleUser.username}</span>
                                                {
                                                  singleUser.following && singleUser.following.includes(user.uid) ?
                                                      <small>Follows you</small>
                                                   :
                                                   ''
                                                }
                                             </div>
                                             {
                                                userCollection.following && userCollection.following.includes(singleUser.id) ? 
                                                  
                                                   <Button 
                                                      variant="contained" 
                                                      color="primary" 
                                                      size="small"
                                                      onClick={() => unfollowUser(singleUser)}
                                                   >
                                                      Following
                                                   </Button> 
                                                :
                                                   <Button 
                                                   variant="outlined" 
                                                   color="primary" 
                                                   size="small"
                                                   onClick={() => followUser(singleUser)}
                                                   >
                                                      Follow
                                                   </Button>
                                             }
                                          </div>
                                          <Divider />
                                       </div>
                                    :
                                    ''
                                 }
                              </div>
                           :
                           ''
                        }
                     </div>
                  ))
               }
            </div>
         </div>
      </div>
   );
}
 
export default People;