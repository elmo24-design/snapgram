import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import { motion } from 'framer-motion';
//Radio fields
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { projectFirestore, projectStorage, timestamp } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import useCurrentUser from '../hooks/useCurrentUser';

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

const AddModal = ({setAddModal}) => {
   const classes = useStyles();
   const [isPending,setIsPending] = useState(false)
   const [error,setError] = useState(null)
   const [progress,setProgress] = useState(0)
   const types = ['image/png','image/jpeg']
   const modalRef = useRef()

   //user creds
   const {user} = useAuth()
   const {userCollection} = useCurrentUser('users')

   //for image preview
   const [imageUrl,setImageUrl] = useState(null) 

   //Post states
   const [description,setDescription] = useState('')
   const [file,setFile] = useState(null)
   const [status,setStatus] = useState(null)

   //errors
   const [descError,setDescError] = useState(false)
   const [statusError,setStatusError] = useState(false)

   //helper texts for errors
   const [descErrorText,setDescErrorText] = useState('')
   const [statusErrorText,setStatusErrorText] = useState('')
   const [fileErrorText,setFileErrorText] = useState(false)

   const scrollToBottom = () => {
      modalRef.current.scrollIntoView({ behavior: 'smooth' })
   }

   useEffect(() => {
      scrollToBottom()
   }, [description,file,status,isPending])
   

   //functions
   const closeModal = (e) => {
      if(e.target.classList == 'backdrop'){
         setAddModal(false)
      }
   }
   const changeHandler = (e) => {
      let selected = e.target.files[0]
      console.log(selected)

      if(selected && types.includes(selected.type)){
         setFile(selected)
         setFileErrorText('')
         setImageUrl(URL.createObjectURL(e.target.files[0]))
      }else{
         setFile(null)
         setFileErrorText('Please select an image file (png or jpeg)')
      }
   }
   const handleChange = (e) => {
      setStatus(e.target.value)
   }

   //Submit form
   const handleSubmit = async(e) => {
      e.preventDefault()

      setIsPending(true)
      if(validate(description,file,status)){
         const filePath = `covers/memories/${file.name}`
         const storageRef = projectStorage.ref(filePath)

         storageRef.put(file).on('state_changed', (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100 
            setProgress(percentage)
         }, (err) => {
            setError(err)
         }, async() => {
            const url = await storageRef.getDownloadURL()
            await projectFirestore.collection('memories').add({
               description: description, 
               backgroundUrl: url,
               filePath: filePath,
               status: status,
               userId: user.uid,
               likes: [],
               followers: [ ...userCollection.followers, user.uid],
               createdAt: timestamp()
            })
            setIsPending(false)
            setAddModal(false)
         })
      }
      else{
         setIsPending(false)
      }
   }
   const validate = (description,file,status) => {
      if(description === ''){
         setDescError(true)
         setDescErrorText('This field is required')
      }else{
         setDescError(false)
         setDescErrorText('')
      }

      if(file === null){
         setFileErrorText('Please select an image file (png or jpeg)')
      }else{
         setFileErrorText('')
      }

      if(status === null){
         setStatusError(true)
         setStatusErrorText('Please select one of the options')
      }else{
         setStatusError(false)
         setStatusErrorText('')
      }

      if(description && file && status){
         return true
      }else{
         return false
      }
   }

   return ( 
      <motion.div 
         className="backdrop"
         variants={backdrop}
         initial="hidden"
         animate="visible"
         exit="hidden"
         onClick={closeModal}
      >
         <motion.div className="modal edit-info add-modal" variants={modal} >
            <h1 className="add-heading">Add a Memory...</h1>
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
               <div className="input">
                  <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={changeHandler}
                  />
                  <label htmlFor="contained-button-file">
                     <Button variant="contained" color="primary" component="span">
                        <PhotoCamera className={classes.camera}/> Add Image
                     </Button>
                  </label>
                  {
                     imageUrl && (
                        <div>
                           <img src={imageUrl} alt="file" className="imageUrl"/>
                        </div>
                     )
                  }
                  {
                     fileErrorText && (
                        <div className="error">{fileErrorText}</div>
                     )
                  }
               </div>
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
                           Uploading...
                        </Button>
                        <motion.div className="progress-add"
                           initial={{ width: 0}}
                           animate={{ width: progress + '%'}}
                        >
                        </motion.div>
                     </div>
                     :
                     <div>
                        <Button type="submit" variant="contained" color="primary" className={classes.btn}>
                           Upload
                        </Button>
                        <Button variant="contained" className={classes.btnCancel} onClick={() => setAddModal(false)}>
                           Cancel
                        </Button>
                     </div>
                  }
                  {
                     error && (
                        <div className="error err2">{error}</div>
                     )
                  }
               </div>
            </form>
            <div ref={modalRef}></div>
         </motion.div>
      </motion.div>
   );
}
 
export default AddModal;