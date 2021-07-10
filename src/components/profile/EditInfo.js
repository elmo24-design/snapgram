import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { motion } from 'framer-motion';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import { projectFirestore } from '../../firebase/config';

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
      y: '100px',
      opacity: 1,
      transition: {
         delay: 0.1
      }
   }
}

const useStyles = makeStyles((theme) => ({
   editBtn: {
      fontSize: '1.7rem',
      padding: '0 1rem 0 0'
   },
   field: {
      marginBottom: '1rem'
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

const EditInfo = ({setEditInfo,user,userCollection,updateEmail}) => {
   const classes= useStyles()
   const [isPending,setIsPending] = useState(false)
   const [username,setUserName] = useState(userCollection.username)
   const [email,setEmail] = useState(user.email)
   const [bio,setBio] = useState(userCollection.bio)
   const [website,setWebsite] = useState(userCollection.website)

   //general error
   const[error,setError] = useState(null)

   //errors
   const [usernameError,setUsernameError] = useState(false)
   const [emailError,setEmailError] = useState(false)
   const [websiteError,setWebsiteError] = useState(false)

   //error text
   const [usernameErrorText,setUsernameErrorText] = useState('')
   const [emailErrorText,setEmailErrorText] = useState('')
   const [websiteErrorText,setWebsiteErrorText] = useState('')

   //Regular Expressions
   var emailExpression = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
   var urlExpression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

   var emailRegex = new RegExp(emailExpression);
   var urlRegex = new RegExp(urlExpression)
   

   const closeModal = (e) => {
      if(e.target.classList.contains('backdrop')){
         setEditInfo(false)
      }
   }

   const handleSubmit = async(e) => {
      e.preventDefault()

      setIsPending(true)
      try{
         if(validate(username,email,website)){
            if(email !== user.email){
               await updateEmail(email)
            }
   
            await projectFirestore.collection('users').doc(user.uid).update({
               username: username,
               bio: bio,
               website: website
            })
            .then(() => {
               setEditInfo(false)
            })
            .catch((err) => console.log(err)) 
            
            setIsPending(false)
            console.log('user updated')            
         }else{
            setIsPending(false)
         }
      }
      catch(err){
         console.log(err)
         setError(err.message)
         setIsPending(false)
      }
   }

   const validate = (username,email,website) => {
      if(username === ''){
         setUsernameError(true)
         setUsernameErrorText('Username is Required')
      }else{
         setUsernameError(false)
         setUsernameErrorText('')
      }

      if(email === ''){
         setEmailError(true)
         setEmailErrorText("Email is Required")
      }else if(email !== '' && !email.match(emailRegex)){
         setEmailError(true)
         setEmailErrorText("Email should be valid")
      }else{
         setEmailError(false)
         setEmailErrorText("")
      }

      if(website === ''){
         setWebsiteError(false)
         setWebsiteErrorText('')
      }
      else if(!website.match(urlRegex)){
         setWebsiteError(true)
         setWebsiteErrorText('Invalid URL')
      }else{
         setWebsiteError(false)
         setWebsiteErrorText('')
      }
      
      if(username && email && email.match(emailRegex)){
         if(website.match(urlRegex) || website === ''){
            reset()
            return true
         }
      }else{
         return false
      }
   }

   const reset = () => {
      setUsernameError(false)
      setEmailError(false)
      setWebsiteError(false)
      setUsernameErrorText('')
      setEmailErrorText('')
      setWebsiteErrorText('')
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
         <motion.div className="modal edit-info" variants={modal}>
            <div className="heading-edit-info">
               <EditIcon className={classes.editBtn} />
               <h1>Edit Basic Info</h1>
            </div>
            <form autoComplete="off" onSubmit={handleSubmit}>
               <TextField 
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  label="Username" 
                  fullWidth
                  className={classes.field}
                  error={usernameError}
                  helperText={usernameErrorText}
               />
               <TextField 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email" 
                  fullWidth
                  className={classes.field}
                  error={emailError}
                  helperText={emailErrorText}
               />
               <TextField 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  label="Bio" 
                  fullWidth
                  className={classes.field}
               />
               <TextField 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  label="Personal Website" 
                  fullWidth
                  className={classes.field}
                  error={websiteError}
                  helperText={websiteErrorText}
               />
               {
                  isPending ? 
                  <Button type="submit" disabled variant="contained" color="primary" className={classes.btn}>
                     Saving...
                  </Button>
                  :
                  <Button type="submit" variant="contained" color="primary" className={classes.btn}>
                     Save
                  </Button>
               }
               <Button variant="contained" className={classes.btnCancel} onClick={() => setEditInfo(false)}>
                  Cancel
               </Button>
               {
                  error && (
                     <div className="error err2">{error}</div>
                  )
               }
            </form>
         </motion.div>
      </motion.div>
   );
}
 
export default EditInfo;