import {Avatar} from '@material-ui/core';
import useAllPosts from '../hooks/useAllPosts';
import moment from 'moment'
import { useEffect, useState } from 'react';
import { projectFirestore } from '../firebase/config';

const NotifInner = ({user,notif,setSelectedPost}) => {
   const {docs} = useAllPosts('memories')
   const [formattedDate,setFormattedDate] = useState(null)

   useEffect(() => {
      setFormattedDate(moment(notif.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a'))
   }, [user,notif])

   const handleClick = async(doc) => {
      if(doc){
         setSelectedPost(doc)
      }
      if(notif.className === 'card-notif-active'){
         await projectFirestore.collection('notifications').doc(notif.id).update({
            className: 'card-notif'
         })
      }
   }

   return ( 
      <div className="inner-card">
         <Avatar src={user.profilePic} alt="avatar"/>
         <div className="right">
            <div>
               <span className="formatted-date">{formattedDate}</span>
               <div><span className="username-notif">{user.username}</span>{notif.body} </div>
            </div>
            {
               docs && docs.map(doc => ( 
                  <div key={doc.id} onClick={() => handleClick(doc)}>
                     {
                        notif.postId === doc.id ?  
                           <span className="notif-desc">"{doc.description}"</span>
                        :
                        null
                     }
                  </div>
                  
               ))
            }
         </div>
      </div>
   );
}
 
export default NotifInner;