import { makeStyles } from '@material-ui/core/styles'
import {motion} from 'framer-motion';
import useAllPublicPosts from '../hooks/useAllPublicPosts';
import useAllUsers from '../hooks/useAllUsers';
import {Avatar} from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import {Link} from 'react-router-dom';

const imgVariants = {
   hover: {
      opacity: 1
   }
}
const uploadedVariants ={
   hidden: {
      opacity: 0
   },
   visible: {
      opacity: 1,
   }
}

const useStyles = makeStyles((theme) => ({
   card: {
      padding: '30%',
      height: '100%',
      textAlign: 'center'
   },
   icon:{
      fontSize: '3rem',
   },
   small: {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5)
   },
   link: {
      color: 'black'
   }

}))

const ImageGridHome = ({setSelectedPost,setLikedPost,likePost,unlikePost}) => {
   const classes = useStyles()
   const {docs} = useAllPublicPosts('memories')
   const {usersCollection} = useAllUsers('users')
   const {user} = useAuth()

   return ( 
      <div>
         {
            docs.length !== 0 ?
               <div className="img-grid"> 
                  {docs && docs.map(doc => (
                     <div key={doc.id}>      
                        <motion.div className="img-wrap"
                           layout
                           variants={imgVariants}
                           whileHover="hover"
                           onClick={()=> setSelectedPost(doc)}
                           >
                           <motion.img src={doc.backgroundUrl} alt="upload"
                           variants={uploadedVariants}
                           initial="hidden"
                           animate="visible"
                           />
                        </motion.div>
                        {
                           usersCollection && usersCollection.map(owner => (
                              <div key={owner.id}>
                                 {
                                    doc.userId === owner.id ?
                                       <div className="card-bottom-home">
                                          <div className="user-bottom-home">
                                             <Avatar src={owner.profilePic} className={classes.small}/>
                                             <Link to={`/user/${owner.id}`} className={classes.link}>
                                                <small className="small-bottom-home">{owner.username}</small>
                                             </Link>
                                          </div>
                                          <div className="icons-home">
                                             {
                                             user && doc.likes.includes(user.uid) ? 
                                                   <i class="fas fa-heart" id="liked" onClick={() => unlikePost(doc,doc.id)}></i>
                                                :
                                                   <i class="far fa-heart" onClick={() => likePost(doc, doc.id)}></i>
                                             }
                                             <small className="heart-length" 
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
                                             <i class="far fa-comment" onClick={() => setSelectedPost(doc)}></i>
                                          </div> 
                                       </div>
                                    :
                                    ''
                                 }
                              </div>
                           ))
                        }
                     </div>
                  ))}
               </div>
            :
            <div>
               You're not following anyone yet or you have no posts yet
            </div>
         }
      </div>
   );
}
 
export default ImageGridHome;