import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import snapgramLeft from '../images/snapgram-left.png';
import snapgram1 from '../images/snapgram-1.png';
import snapgram2 from '../images/snapgram-2.png';
import snapgram3 from '../images/snapgram-3.png';
import snapgram4 from '../images/snapgram-4.png';

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

const Signin = () => {
   const history = useHistory()
   const classes = useStyles()
   const regex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/

   //sign in
   const [error,setError] = useState(null)
   const [isPending,setIsPending] = useState(false)

   //states
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   //errors
   const [emailError, setEmailError] = useState(false)
   const [passwordError, setPasswordError] = useState(false)

   //error messages
   const [emailErrorText, setEmailErrorText] = useState('')
   const [passwordErrorText, setPasswordErrorText] = useState('')

   //Slide show
   let [iteration,setIteration] = useState(0)
   let [images, setImages] = useState([])

   images[0] = snapgram1
   images[1] = snapgram2
   images[2] = snapgram3
   images[3] = snapgram4

   const changeImg = () => {
      if(iteration < images.length -1){
         setIteration(iteration+=1)
      }else{
         setIteration(0)
      }
   }

   useEffect(() => {
      setTimeout(() => {
         changeImg()
      },4000)
   })
      

   const handleSubmit = async(e) => {
      e.preventDefault() 
      if(validate(email, password)){
         setError(null)
         setIsPending(true)
         try{
            const res = await projectAuth.signInWithEmailAndPassword(email,password)
            if(!res){
               throw new Error('could not complete the sign in')
            }

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

   const validate = (email, password) => {
      
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
   

      if(email && password && regex.test(email)){
         reset()
         return true
      }else{
         return false
      }
   }

   const reset = () => {
      setEmailError(false)
      setPasswordError(false)
      setEmailErrorText('')
      setPasswordErrorText('')
   }


   return ( 
      <div className="sign-in">
         <div className="signin-img-wrapper">
            <img src={snapgramLeft} alt="pic" className="snapgram-left"/>
            <img src={images[iteration]} alt="" className="images"/>
         </div>
         <div className="card-wrapper">
            <Card className="card">
               <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <h1>Snapgram</h1>
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
                           Loading...Please Wait...
                        </Button>
                     :
                        <Button
                        fullWidth
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        >
                           Log in
                        </Button> 
                  }
                  <Link to="/signup">
                     <p className="small">Don't have an account yet? <span>Sign up</span></p>
                  </Link>
               </form>
            </Card>
         </div>
      </div>
   );
}
 
export default Signin;