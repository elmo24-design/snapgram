import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles'
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
   icon: {
      color: 'white',
      fontSize: '1.3rem'
   },
   header:{
      zIndex: 1
   },
   list: { 
      width: '10rem',
      backgroundColor: theme.palette.background.paper,
   },
   active: {
      color: 'rgb(0, 238, 255)'
   },
   link:{
      color: 'black'
   }
}))

const HeaderChat = () => {
   const classes= useStyles();
   const location = useLocation();

   return ( 
      <AppBar position="fixed" className={classes.header}>
         <div className="container chat-container">
            <div className="chat-navbar">   
               <div className="title-chat">
                  <Link to="/home">
                     Snapgram Chatroom
                  </Link>
               </div>
               <div className="icons-chat">
                  <Link to="/chat" className={location.pathname=== '/chat' ? classes.active : null}> 
                     <i class="fas fa-comments"></i>
                  </Link>
                  <Link to="/home"> 
                     <i class="fas fa-home"></i>
                  </Link>
               </div>
            </div>
         </div>
      </AppBar>
   );
}
 
export default HeaderChat;