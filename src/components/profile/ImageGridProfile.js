import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles'
import {motion} from 'framer-motion';
import { useLocation } from 'react-router';

const imgVariants = {
   hover: {
      opacity: 1
   }
}
const uploadedVariants ={
   cardWrapper: {
      height:'160px'
   },
   hidden: {
      opacity: 0
   },
   visible: {
      opacity: 1,
      transition: {
         delay: 0.5
      }
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

}))

const ImageGridProfile = ({setAddModal,setSelectedPost,docs}) => {

   const classes = useStyles()
   const location = useLocation()

   return ( 
      <div className="img-grid"> 
         {
            location.pathname === '/profile' ?
            <Card button onClick={() => setAddModal(true)} className={classes.cardWrapper}>
               <CardActionArea className={classes.card}>
                  <AddIcon className={classes.icon} color="primary"/>
               </CardActionArea>
            </Card> 
            :
            ''
         }
         {
            docs.length !== 0 ?
               <>
                  {docs && docs.map(doc => (
                     <motion.div className="img-wrap" key={doc.id}
                     layout
                     variants={imgVariants}
                     whileHover="hover"
                     onClick={() => setSelectedPost(doc)}
                     >
                        <motion.img src={doc.backgroundUrl} alt="upload"
                           variants={uploadedVariants}
                           initial="hidden"
                           animate="visible"
                        />
                     </motion.div>
                  ))}
               </>
            :
            <div>Nothing to show here yet</div>
         }
        
      </div>
   );
}
 
export default ImageGridProfile;