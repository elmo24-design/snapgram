import React, { useContext, useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { projectAuth } from '../firebase/config';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
   const [loading, setLoading] = useState(true)
   const [user, setUser] = useState(null)
   const history = useHistory()

   useEffect(() => {
      projectAuth.onAuthStateChanged(_user => {
         setUser(_user)
         setLoading(false)
         if(user){
            history.push('/home')
         }else{
            history.push('/')
         }
      })
   }, [user, history])

   //update email
   const updateEmail = (email) => {
      return user.updateEmail(email)
   }
   //update password
   const updatePassword = (password) => {
      return user.updatePassword(password)
   }

   const value = { 
      user,
      updateEmail,
      updatePassword 
   }

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   )
}


