import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { projectAuth, projectFirestore, timestamp} from '../firebase/config';

const useStyles = makeStyles({
   field: {
      marginTop: 20,
      marginBottom: 20,
      display: 'block',
   },
   button: {
      padding:'0.7rem'
   },
})

const Signup = () => {
   const classes = useStyles()
   const regex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
   const history = useHistory()

   //sign up states
   const [error,setError] = useState(null)
   const [isPending,setIsPending] = useState(false)

   //States
   const [displayName, setDisplayName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [passwordConfirm, setPasswordConfirm] = useState('')

   //Errors
   const [displayNameError, setDisplayNameError] = useState(false)
   const [emailError, setEmailError] = useState(false)
   const [passwordError, setPasswordError] = useState(false)
   const [passwordConfirmError, setPasswordConfirmError] = useState(false)
   
   //Error Messages
   const [displayNameErrorText, setDisplayNameErrorText] = useState('')
   const [emailErrorText, setEmailErrorText] = useState('')
   const [passwordErrorText, setPasswordErrorText] = useState('')
   const [passwordConfirmErrorText, setPasswordConfirmErrorText] = useState(false)

   const handleSubmit = async(e) => {
      e.preventDefault() 
      if(validate(displayName, email, password, passwordConfirm)){
         setError(null)
         setIsPending(true)
         try{
            await projectAuth.createUserWithEmailAndPassword(email,password)
            .then((cred) => {
               projectFirestore.collection('users').doc(cred.user.uid).set({
                  username: displayName,
                  bio: '',
                  profilePic: null,
                  website: '',
                  followers: [],
                  following: [],
                  notifications: [],
                  createdAt: timestamp()
               })
            })
            history.push('/home')
            setError(null)
            setIsPending(false)
         }
         catch(err){
            console.log(err.message)
            setError(err.message)
            setIsPending(false) 
         }
      }
   }

   const validate = (displayName, email, password, passwordConfirm) => {
      if(displayName === ''){
         setDisplayNameError(true)
         setDisplayNameErrorText('Username is Required')
      }else{
         setDisplayNameError(false)
         setDisplayNameErrorText('')
      }

      if(email === ''){
         setEmailError(true)
         setEmailErrorText("Email is Required")
      }else if(email !== '' && !regex.test(email)){
         setEmailError(true)
         setEmailErrorText("Email should be valid")
      }else{
         setEmailError(false)
         setEmailErrorText("")
      }

      if(password === ''){
         setPasswordError(true)
         setPasswordErrorText("Password is Required")
      }else{
         setPasswordError(false)
         setPasswordErrorText("")
      }
      
      if(passwordConfirm === ''){
         setPasswordConfirmError(true)
         setPasswordConfirmErrorText("Password Confirmation is Required")
      }else if(passwordConfirm !== password){
         setPasswordConfirmError(true)
         setPasswordConfirmErrorText("Password does not match")
      }else{
         setPasswordConfirmError(false)
         setPasswordConfirmErrorText("")
      }

      if(displayName && email && password && passwordConfirm && regex.test(email) && password === passwordConfirm){
         reset()
         return true
      }else{
         return false
      }
   }

   const reset = () => {
      setDisplayNameError(false)
      setEmailError(false)
      setPasswordError(false)
      setPasswordConfirmError(false)
      setDisplayNameErrorText('')
      setEmailErrorText('')
      setPasswordErrorText('')
      setPasswordConfirmErrorText('')
   }

   return ( 
      <div className="sign-in">
         <div className="card-wrapper-signup">
            <Card className="card">
               <form noValidate autoComplete="off"
               onSubmit={handleSubmit}
               >
                  <h1>Snapgram</h1>
                  <TextField
                     value={displayName}
                     onChange={(e) => setDisplayName(e.target.value)}
                     fullWidth 
                     className={ classes.field }
                     id="outlined-basic" 
                     label="Username" 
                     variant="filled" 
                     required 
                     error={displayNameError}
                     helperText={displayNameErrorText}
                     />
                  <TextField
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     fullWidth 
                     className={ classes.field }
                     required id="outlined-basic" 
                     label="E-Mail Address"
                     error={emailError}
                     helperText={emailErrorText}
                     variant="filled" />
                  <TextField
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     fullWidth 
                     className={ classes.field }
                     required 
                     id="outlined-basic" 
                     label="Password" 
                     type="password"
                     variant="filled"
                     error={passwordError}
                     helperText={passwordErrorText}
                     />
                  <TextField
                     value={passwordConfirm}
                     onChange={(e) => setPasswordConfirm(e.target.value)}
                     fullWidth 
                     className={ classes.field }
                     required 
                     id="outlined-basic" 
                     label="Confirm Password" 
                     type="password"
                     variant="filled"
                     error={passwordConfirmError}
                     helperText={passwordConfirmErrorText}
                     />
                  {
                     error && (
                        <div className="error">
                           { error }
                        </div>
                     )
                  }
                  {
                     isPending ? 
                        <Button
                        fullWidth
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled
                        >
                           Loading...
                        </Button>
                     :
                        <Button
                        fullWidth
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        >
                           Sign up
                        </Button> 
                  }
                  
                  <Link to="/">
                     <p className="small">Already have an account? <span>Sign in</span></p>
                  </Link>
               </form>
            </Card>
         </div>
      </div>
   );
}
 
export default Signup;