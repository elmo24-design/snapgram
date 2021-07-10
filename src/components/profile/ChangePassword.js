import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { motion } from 'framer-motion';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
      y: '150px',
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

const ChangePassword = ({setChangePassword}) => {
   const classes = useStyles()
   const {updatePassword} = useAuth()
   //States
   const [password,setPassword] = useState('')
   const [passwordConfirmation,setPasswordConfirmation] = useState('')
   const [isPending,setIsPending] = useState(false)
   const [error,setError] = useState(null)
   
   //errors
   const [passwordConfirmError,setPasswordConfirmError] = useState(false)
   const [passwordError,setPasswordError] = useState(false)

   //error helper texts
   const [passwordConfirmErrorText,setPasswordConfirmErrorText] = useState('')
   const [passwordErrorText,setPasswordErrorText] = useState('')

   //functions
   const handleSubmit = async(e) => {
      e.preventDefault()

      setIsPending(true)
      try{ 
         if(validate(password,passwordConfirmation)){
            await updatePassword(password)

            setIsPending(false)
            setChangePassword(false)
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

   const validate = (password,passwordConfirmation) => {
      if(password === ''){
         setPasswordError(true)
         setPasswordErrorText('Password is Required')
      }
      else{
         setPasswordError(false)
         setPasswordErrorText('')
      }

      if(passwordConfirmation === ''){
         setPasswordConfirmError(true)
         setPasswordConfirmErrorText('Please Confirm your new password')
      }
      else if(password !== passwordConfirmation){
         setPasswordConfirmError(true)
         setPasswordConfirmErrorText('Password does not match')
      }
      else{
         setPasswordConfirmError(false)
         setPasswordConfirmErrorText('')
      }

      if(password && passwordConfirmation && password === passwordConfirmation){
         reset()
         return true
      }else{
         return false
      }
   }

   const reset = () => {
      setPasswordError(false)
      setPasswordConfirmError(false)
      setPasswordErrorText('')
      setPasswordConfirmErrorText('')
   }

   const closeModal = (e) => {
      if(e.target.classList.contains('backdrop')){
         setChangePassword(false)
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
         <motion.div className="modal edit-info" variants={modal}>
            <div className="heading-edit-info">
               <EditIcon className={classes.editBtn} />
               <h1>Change Password</h1>
            </div>
            <form autoComplete="off" onSubmit={handleSubmit}>
               <TextField 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="New Password" 
                  fullWidth
                  className={classes.field}
                  error={passwordError}
                  helperText={passwordErrorText}
               />
               <TextField 
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  label="Confirm new Password" 
                  fullWidth
                  className={classes.field}
                  error={passwordConfirmError}
                  helperText={passwordConfirmErrorText}
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
               <Button variant="contained" className={classes.btnCancel} onClick={() => setChangePassword(false)}>
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
 
export default ChangePassword;