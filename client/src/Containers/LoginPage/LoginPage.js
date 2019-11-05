import React, { useState } from "react";
import { connect } from "react-redux";
import "./LoginPage.css";
import { userLogging } from "../../actions/index";
import classnames from "classnames";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { CssBaseline } from "@material-ui/core";

const mapDispatchToProps = dispatch => {
  return {
    userLogging: userLog => dispatch(userLogging(userLog))
  };
};

const mapStateToProps = state => {
  return {
    loginErrors: state.loginErrors
  };
};

const LoginPage = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userLogging, loginErrors } = props;

  const onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password
    };
    userLogging(userData);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <div className="loginPageBackground">
        <div className="loginForm pa4 shadow-3">
          <div>
            <p className="tc f3" style={{ letterSpacing: "1.5px" }}>
              Login
            </p>
            <form noValidate onSubmit={onSubmit}>
              <div>
                <Input
                  value={email}
                  placeholder="Email"
                  error={loginErrors.email}
                  id="email"
                  type="email"
                  className={classnames("pa1", {
                    invalid: loginErrors.email || loginErrors.emailnotfound
                  })}
                  style={{ width: "25vw" }}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                />
                <p className="red">
                  {loginErrors.email}
                  {loginErrors.emailnotfound}
                </p>
              </div>
              <div>
                <Input
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  value={password}
                  error={loginErrors.password}
                  id="password"
                  type="password"
                  className={classnames("pa1", {
                    invalid:
                      loginErrors.password !== undefined ||
                      loginErrors.passwordincorrect !== undefined
                  })}
                  style={{ width: "25vw" }}
                />
                <p className="red">
                  {loginErrors.password}
                  {loginErrors.passwordincorrect}
                </p>
              </div>
              <div className="tr" style={{ paddingLeft: "11.250px" }}>
                <Button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="tc"
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
