import React, { useState, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import SearchIcon from '@material-ui/icons/Search';
import {Avatar, Divider} from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles'
import { projectAuth, projectFirestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
import useCurrentUser from '../hooks/useCurrentUser';
import useAllUsers from '../hooks/useAllUsers';
import { useAuth } from '../contexts/AuthContext';
//add button
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
//lists ui for the pop over
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//icons
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const useStyles = makeStyles((theme) => ({
   small: {
      width: theme.spacing(4),
      height: theme.spacing(4)
   },
   notif: {
      backgroundColor: '#FF003D',
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: '14px'
   },
   create:{
      width: theme.spacing(5.5),
      height: theme.spacing(5.5),
      marginLeft: '1rem'
   },
   icon: {
      color: 'white',
      fontSize: '1.3rem'
   },
   list: { 
      width: '10rem',
      backgroundColor: theme.palette.background.paper,
   },
   active: {
      color: 'rgb(0, 238, 255)'
   },
   active_popover: {
      background: '#f4f4f4',
   },
   header:{
      zIndex: '1'
   }
}))

const Header = ({setAddModal}) => {
   const classes= useStyles();
   const [anchorEl, setAnchorEl] = useState(null)
   const history = useHistory()
   const location = useLocation()
   const {userCollection} = useCurrentUser('users')
   const {usersCollection} = useAllUsers('users')
   const {user} = useAuth()
   // live search states
   const searchText = useRef()
   const [matches,setMatches] = useState([])

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleDelete = async() => {
      await projectFirestore.collection('users').doc(user.uid).update({
         notifications: []
      })
   }

   const signOut = async() => {
      await projectAuth.signOut()

      await history.push('/')
   }

   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;

   //live search
   const searchForUsers = async(e) => {
      let matches = usersCollection.filter(singleUser => {
         const regex = new RegExp(`^${searchText.current.value}`, 'gi');
         return singleUser.username.match(regex)
      })
      setMatches(matches)

      if(searchText.current.value === ''){
         setMatches([])
      }
   }
  
   return ( 
      <AppBar position="fixed" className={classes.header}>
         <div className="container">
            <div className="navbar">   
               <div className="title">
                  <Link to="/home">
                     Snapgram
                  </Link>
                  {
                     location.pathname=== '/home' ?
                        <Fab color="secondary" aria-label="edit" className={classes.create} onClick={() => setAddModal(true)}>
                           <EditIcon className={classes.icon} />
                        </Fab>
                     :
                     ''
                  }
               </div>
               <div className="searchField">
                  <div className="search-inner">
                     <SearchIcon />
                     <input type="text" 
                        className="search-input" 
                        placeholder="Search..."
                        ref={searchText}
                        onChange={searchForUsers}
                     />
                  </div>
                  <div className="match-list">
                     {
                        searchText ?
                           <div className="card-body">
                              {
                                 matches.map(match => (
                                    <div>
                                       <div className="card-body-inner" key={match.id}>
                                          <Avatar src={match.profilePic} alt="avatar" className={classes.small} />
                                          <span>{match.username}</span>
                                       </div>
                                       <Divider />
                                    </div>
                                 ))
                              }
                           </div>
                        :
                        ''
                     }
                  </div>
               </div>
               <div className="icons">
                  <Link to="/home" className={location.pathname=== '/home' ? classes.active : null}> 
                     <i class="fas fa-home"></i>
                  </Link>
                  <i class="fab fa-facebook-messenger"></i>
                  <Link to="/people" className={location.pathname=== '/people' ? classes.active : null}>
                     <i class="fas fa-user-friends"></i>
                  </Link>
                  <div className="notif-box">
                     <Link to="/notifications" className={location.pathname=== '/notifications' ? classes.active : null}>
                        <i class="fas fa-bell" onClick={handleDelete}></i>
                     </Link>                   
                        {
                           userCollection.notifications && userCollection.notifications.length !== 0 
                           ?
                              <div className="red-chip">
                                 <Avatar className={classes.notif}>
                                    {userCollection.notifications.length}
                                 </Avatar>  
                              </div>
                           :
                           ''
                        }
                  </div>
                  {
                    user && userCollection.profilePic ?
                     <Avatar 
                        src={userCollection.profilePic} 
                        id="avatar" 
                        className={classes.small}
                        aria-describedby={id}
                        onClick={handleClick}
                     /> :
                     <Avatar 
                        id="avatar" 
                        className={classes.small}
                        aria-describedby={id}
                        onClick={handleClick}
                     />
                  }                 
                   <Popover
                     id={id}
                     open={open}
                     anchorEl={anchorEl}
                     onClose={handleClose}
                     anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                     }}
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                     }}  
                  >
                     <List className={classes.list} aria-label="mailbox folders">
                        <Link to="/profile" className="profile-link">
                           <ListItem key="profile" divider button className={ location.pathname === '/profile' ? classes.active_popover : null} >
                                 <ListItemIcon>
                                    <PersonIcon/>
                                 </ListItemIcon>
                                 <ListItemText primary="Profile"/>
                           </ListItem>
                        </Link>
                        {/* <ListItem button divider>
                           <ListItemIcon>
                              <SettingsIcon/>
                           </ListItemIcon>
                           <ListItemText primary="Settings" />
                        </ListItem> */}
                        <ListItem button onClick={signOut}>
                           <ListItemIcon>
                              <ExitToAppIcon/>
                           </ListItemIcon>
                           <ListItemText primary="Sign Out" />
                        </ListItem>
                     </List>
                  </Popover>
               </div>
            </div>
         </div>
      </AppBar>
   );
}
 
export default Header;