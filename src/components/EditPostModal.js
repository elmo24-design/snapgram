import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { motion } from 'framer-motion';
//Radio fields
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { projectFirestore } from '../firebase/config';

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
      y: '80px',
      opacity: 1,
      transition: {
         delay: 0.2
      }
   }
}

const useStyles = makeStyles((theme) => ({
   input: {
     display: 'none',
   },
   camera: {
      paddingRight: '0.5rem'
   },
   field:{
      marginBottom: '1rem'
   },
   status: {
      marginTop: '1rem'
   },
   btn: {
      marginTop: '1rem',
      marginBottom: '-0.5rem',
      fontWeight: 'bold'
   },
   btnCancel: {
      marginTop: '1rem',
      marginBottom: '-0.5rem',
      marginLeft: '0.5rem',
      fontWeight: 'bold'
   }
 }));

const EditPostModal = ({setEditPostModal,selectedPost,setSelectedPost}) => {
   const classes = useStyles();
   const [isPending,setIsPending] = useState(false)
   
   const modalRef = useRef()

   //Post states
   const [description,setDescription] = useState(selectedPost.description)
   const [status,setStatus] = useState(selectedPost.status)

   //errors
   const [descError,setDescError] = useState(false)
   const [statusError,setStatusError] = useState(false)

   //helper texts for errors
   const [descErrorText,setDescErrorText] = useState('')
   const [statusErrorText,setStatusErrorText] = useState('')

   const scrollToBottom = () => {
      modalRef.current.scrollIntoView({ behavior: 'smooth' })
   }

   useEffect(() => {
      scrollToBottom()
   }, [description,status,isPending])
   

   //functions
   const closeModal = (e) => {
      if(e.target.classList.contains('backdrop')){
         setEditPostModal(false)
      }
   }
 
   const handleChange = (e) => {
      setStatus(e.target.value)
   }

   //Submit form
   const handleSubmit = async(e) => {
      e.preventDefault()

      setIsPending(true)
      if(validate(description,status)){
         await projectFirestore.collection('memories').doc(selectedPost.id).update({
            description: description, 
            status: status
         })
         setIsPending(false)
         setEditPostModal(false)
         setSelectedPost(null)
      }
      else{
         setIsPending(false)
      }
   }
   const validate = (description,status) => {
      if(description === ''){
         setDescError(true)
         setDescErrorText('This field is required')
      }else{
         setDescError(false)
         setDescErrorText('')
      }

      if(status === null){
         setStatusError(true)
         setStatusErrorText('Please select one of the options')
      }else{
         setStatusError(false)
         setStatusErrorText('')
      }

      if(description && status){
         return true
      }else{
         return false
      }
   }

   return ( 
      <motion.div 
         className="backdrop backdrop-top"
         variants={backdrop}
         initial="hidden"
         animate="visible"
         exit="hidden"
         onClick={closeModal}
      >
         <motion.div className="modal edit-info add-modal" variants={modal} >
            <h1 className="add-heading">Edit post...</h1>
            <form autoComplete="off" onSubmit={handleSubmit}>
               <TextField
                  id="standard-multiline-flexible"
                  label="Say something about this post..."
                  multiline
                  rowsMax={4}
                  fullWidth
                  className={classes.field}
                  value={description}
                  onChange={(e) => setDescription(e.target.value) }
                  error={descError}
                  helperText={descErrorText}
               />
               <FormControl component="fieldset" className={classes.status} error={statusError}>
                  <FormLabel component="legend">Show as:</FormLabel>
                  <RadioGroup aria-label="" value={status} onChange={handleChange}>
                     <FormControlLabel value="public" control={<Radio />} label="Public" />
                     <FormControlLabel value="private" control={<Radio />} label="Private" />
                  </RadioGroup>
                  {
                     statusErrorText &&
                     <FormHelperText>{statusErrorText}</FormHelperText>
                  }
               </FormControl>
               <div>
                  {
                     isPending ? 
                     <div>
                        <Button type="submit" disabled variant="contained" color="primary" className={classes.btn}>
                           Updating...
                        </Button>
                     </div>
                     :
                     <div>
                        <Button type="submit" variant="contained" color="primary" className={classes.btn}>
                           Update
                        </Button>
                        <Button variant="contained" className={classes.btnCancel} onClick={() => setEditPostModal(false)}>
                           Cancel
                        </Button>
                     </div>
                  }
               </div>
            </form>
            <div ref={modalRef}></div>
         </motion.div>
      </motion.div>
   );
}
 
export default EditPostModal;