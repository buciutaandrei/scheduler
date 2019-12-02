import React, { useEffect } from "react";
import MainPage from "./Containers/MainPage/MainPage";
import LoginPage from "./Containers/LoginPage/LoginPage";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./Containers/LoginPage/setAuthToken";
import { loggingOut, setUser, setZileLibere } from "./actions/index";
import dayjs from "dayjs";

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loggingOut: logOut => dispatch(loggingOut(logOut)),
    setUser: user => dispatch(setUser(user)),
    setZileLibere: zile => dispatch(setZileLibere(zile))
  };
};

const App = props => {
  useEffect(() => {
    const year = dayjs(props.selectedDate).format("YYYY");
    const yearPlus = dayjs(props.selectedDate)
      .add(1, "year")
      .format("YYYY");
    let array = [];
    fetch(`https://zilelibere.webventure.ro/api/${year}`)
      .then(data => data.json())
      .then(data => (array = array.concat(data)))
      .then(
        fetch(`https://zilelibere.webventure.ro/api/${yearPlus}`)
          .then(data => data.json())
          .then(data => (array = array.concat(data)))
          .then(() => {
            let arrayFinal = [];
            array.map(zile => {
              return zile.date.map(zi => {
                arrayFinal = arrayFinal.concat(new Date(zi.date));
                return arrayFinal;
              });
            });
            props.setZileLibere(arrayFinal);
            console.log("fetched");
          })
      );
  }, []);

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
