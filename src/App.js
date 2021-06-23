import {useState} from 'react';
import { Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./views/Home";
import Profile from './views/Profile';
import Notifications from './views/Notifications';
import Signin from "./views/Signin";
import Signup from "./views/Signup";
import People from './views/People';
import UserProfile from './views/UserProfile';

import { createMuiTheme, ThemeProvider } from '@material-ui/core'

const theme = createMuiTheme({
   palette: {
      primary: {
        main: '#2C5AFF'
      },
      secondary: {
         main: '#00A3FF'
      }
   },
})

function App() {

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
         <AuthProvider>
            <Switch>
               <Route path="/home">
                  <Home />
               </Route>
               <Route path="/profile">
                  <Profile />
               </Route>
               <Route path="/notifications">
                  <Notifications />
               </Route>
               <Route path="/people">
                  <People />
               </Route>
               <Route path="/user/:id">
                  <UserProfile />
               </Route>
               <Route path="/signup">
                  <Signup />
               </Route>
               <Route path="/">
                  <Signin />
               </Route>
            </Switch>
         </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
