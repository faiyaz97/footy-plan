import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import themeFile from "./utility/theme";
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// components test
import NavBar from "./components/layout/Navbar/Navbar";
import AuthRoute from "./utility/AuthRoute";
import axios from 'axios';

// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import user from "./pages/user";
import tournament from "./pages/tournament";
import createTournament from "./pages/createTournament";

const theme = createMuiTheme(themeFile);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    // css
    <ThemeProvider theme={theme}>
      <Provider store={store}>
         {/* Router */} 
        <Router>
           {/* render navigation bar component */} 
          <NavBar />
          <div className="container">
            {/* routes switch */} 
            <Switch>
               {/* login and sign up routes */} 
              <Route exact path="/" component={home} />
              <AuthRoute
                exact
                path="/login"
                component={login}
              />
              <AuthRoute
                exact 
                path="/signup"
                component={signup}
              />
               {/* user page route */} 
              <Route exact path="/users/:handle" component={user} />
              {/* tournaments page route */}
              <Route exact path="/tournaments/:page/:tournamentId" component={tournament} />
               {/* create tournament page route*/} 
              <Route exact path="/createTournament" component={createTournament} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}
export default App;
