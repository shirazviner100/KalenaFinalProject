import React, { useState, useReducer, useEffect, useContext } from "react";

import classnames from "classnames";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";

import ReactBSAlert from "react-bootstrap-sweetalert";

import LoadingSpinner from "components/FormElements/LoadingSpinner.js";

import { useHistory } from "react-router-dom";
import AuthContext from "views/store/auth-context";
import { useHttpClient } from "../../components/hooks/http-hook.js";

// function that returns true if value is email, false otherwise
const verifyEmail = (value) => {
  var emailRex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRex.test(value)) {
    return true;
  }
  return false;
};

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: verifyEmail(action.val) };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: verifyEmail(state.value),
    };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.trim().length > 6,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim().length > 6,
    };
  }
  return { value: "", isValid: false };
};

const Login = () => {
  const [alert, setAlert] = useState(null);
  const [state, setState] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  });

  const { sendRequest } = useHttpClient();

  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    if (authCtx.finishLoggin) {
      const path = "/admin" + "/dashboard";
      history.replace(path);
    }
  }, [authCtx.finishLoggin]);

  const emailChangeHandler = (event) => {
    setState({ ...state, emailFocus: true });
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    setState({ ...state, passFocus: true });
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    setState({ ...state, emailFocus: false });
    dispatchEmail({ type: "INPUT_BLUR" });
    setEnteredEmailTouched(true);
  };

  const validatePasswordHandler = () => {
    setState({ ...state, passFocus: false });
    dispatchPassword({ type: "INPUT_BLUR" });
    setEnteredPasswordTouched(true);
  };

  // function that handles the authentication of the user and references to the dashboard page
  const dashboardPageHandler = async () => {
    const { value: emailValue } = emailState;
    const { value: passwordIValue } = passwordState;

    const enteredEmail = emailValue;
    const enteredPassword = passwordIValue;

    const url = "http://localhost:8080/login/user_login";

    try {
      setIsLoading(true);

      const responseData = await sendRequest(
        url,
        "POST",
        JSON.stringify({
          username: enteredEmail,
          password: enteredPassword,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      const dataExpires = new Date(Math.floor(responseData.expires * 1000)); // number of miliseconds since epoch

      // saves user's authentication
      authCtx.login(
        responseData.obj_id,
        responseData.token,
        responseData.email,
        dataExpires
      );
    } catch (err) {
      setIsLoading(false);
      loginErrorAlert();
    }
  };

  const loginErrorAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Error..."
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        Invalid email or password.
        <br />
        Please try again.
      </ReactBSAlert>
    );
  };

  // this function meant to redirect into the register page by the "Sign Up" button
  const registerPageHandler = (e) => {
    e.preventDefault();
    const path = "/auth/register";
    history.push(path);
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      dashboardPageHandler();
    }
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <>
      <div className="content">
        {alert}
        <Container>
          <Col className="ml-auto mr-auto" lg="4" md="6">
            <Form className="form">
              <Card
                className="card-login card-white"
                style={{ width: "9cm", height: "12cm" }}
              >
                <CardHeader>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    alt="..."
                    src={require("assets/img/card-primary.png").default}
                  />
                  <CardTitle
                    style={{
                      textTransform: "none",
                      fontSize: 60,
                      marginTop: 15,
                      marginLeft: 73,
                    }}
                    tag="h1"
                  >
                    Log in
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <InputGroup
                    className={classnames({
                      "input-group-focus": state.emailFocus,
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText
                        style={{
                          borderColor:
                            !emailIsValid && enteredEmailTouched
                              ? "#e14eca"
                              : "#9a9a9a",
                        }}
                      >
                        <i className="tim-icons icon-email-85" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      style={{
                        borderColor:
                          !emailIsValid && enteredEmailTouched
                            ? "#e14eca"
                            : "#9a9a9a",
                      }}
                      placeholder="Email"
                      type="text"
                      onKeyPress={handleKeypress}
                      onChange={emailChangeHandler}
                      onBlur={validateEmailHandler}
                    />
                  </InputGroup>
                  <FormGroup>
                    {!emailIsValid && enteredEmailTouched && (
                      <label style={{ color: "#b40e0e" }}>Invalid email.</label>
                    )}
                  </FormGroup>

                  <InputGroup
                    className={classnames({
                      "input-group-focus": state.passFocus,
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText
                        style={{
                          borderColor:
                            !passwordIsValid && enteredPasswordTouched
                              ? "#e14eca"
                              : "#9a9a9a",
                        }}
                      >
                        <i className="tim-icons icon-lock-circle" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      style={{
                        borderColor:
                          !passwordIsValid && enteredPasswordTouched
                            ? "#e14eca"
                            : "#9a9a9a",
                      }}
                      placeholder="Password"
                      type="password"
                      onKeyPress={handleKeypress}
                      onChange={passwordChangeHandler}
                      onBlur={validatePasswordHandler}
                    />
                  </InputGroup>
                  <FormGroup>
                    {!passwordIsValid && enteredPasswordTouched && (
                      <div className="category form-category">
                        <label style={{ color: "#b40e0e" }}>
                          Password must contain more than 6 charactars.
                        </label>
                      </div>
                    )}
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button
                    block
                    className="mb-3"
                    type="submit"
                    color="primary"
                    href="#kalena"
                    onClick={dashboardPageHandler}
                    size="lg"
                  >
                    {isLoading && <LoadingSpinner asOverlay />}
                    Login
                  </Button>
                  <div className="pull-left">
                    <h6>
                      <a
                        className="link footer-link"
                        href="#kalena"
                        onClick={registerPageHandler}
                      >
                        Create Account
                      </a>
                    </h6>
                  </div>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default Login;
