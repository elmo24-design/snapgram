import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';

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
      y: '200px',
      opacity: 1,
      transition: {
         delay: 0.1
      }
   }
}

const useStyles = makeStyles((theme) => ({
   list: {
      textAlign: 'center',
   }
}));

const EditModal = ({ setEditModal,setEditInfo,setChangePassword }) => {
   const classes= useStyles()

   const closeBackdrop = (e) => {
      if(e.target.classList.contains('backdrop')){
         setEditModal(false)
      }
   }

   const openEditInfo = () => {
      setEditModal(false)
      setEditInfo(true)
   }

   const openChangePassword = () => {
      setEditModal(false)
      setChangePassword(true)
   }
   
   return ( 
      <motion.div className="backdrop" onClick={closeBackdrop} 
         variants={backdrop}
         initial="hidden"
         animate="visible"
         exit="hidden"
      >
         <motion.div className="modal" variants={modal}>
            <List component="nav" aria-label="main mailbox folders">
               <ListItem button className={classes.list} onClick={openEditInfo}>
                  <ListItemText primary="Edit Basic Info"/>
               </ListItem>
               <Divider />
               <ListItem button className={classes.list} onClick={openChangePassword}>
                  <ListItemText primary="Change Password" />
               </ListItem>
               <Divider />
               <ListItem button className={classes.list} onClick={() => setEditModal(false)}>
                  <ListItemText primary="Cancel"  />
               </ListItem>
            </List>
         </motion.div>
      </motion.div>
   );
}
 
export default EditModal;