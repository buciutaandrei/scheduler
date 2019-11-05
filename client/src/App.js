import React from "react";
import MainPage from "./Containers/MainPage/MainPage";
import LoginPage from "./Containers/LoginPage/LoginPage";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./Containers/LoginPage/setAuthToken";
import { loggingOut, setUser } from "./actions/index";

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loggingOut: logOut => dispatch(loggingOut(logOut)),
    setUser: user => dispatch(setUser(user))
  };
};

const App = props => {
  // Check for token to keep user logged in
  if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    props.setUser(decoded);
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      props.loggingOut(); // Redirect to login
    }
  }

  if (props.loggedIn) {
    return <MainPage />;
  } else {
    return <LoginPage />;
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
