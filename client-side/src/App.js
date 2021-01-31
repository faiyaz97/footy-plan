import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import themeFile from './utility/theme'
// components test
import NavBar from './components/Navbar';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme(themeFile);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <NavBar/>
          <div className="container">
            <Switch>
              <Route exact path="/" component={home}/>
              <Route exact path="/login" component={login}/>
              <Route exact path="/signup" component={signup}/>

            </Switch>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
