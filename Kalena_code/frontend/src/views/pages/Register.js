import React, { useState, useEffect, useReducer } from "react";
import classnames from "classnames";
import ReactBSAlert from "react-bootstrap-sweetalert";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  UncontrolledDropdown,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

import { useHistory } from "react-router-dom";
import LoadingSpinner from "components/FormElements/LoadingSpinner";
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

// function that checks if the character is a letter
const isLetter = (character) => {
  if (character === null) {
    return false;
  } else if (
    (character >= "a" && character <= "z") ||
    (character >= "A" && character <= "Z")
  ) {
    return true;
  }

  return false;
};

// function that returnes true if value is full name, false otherwise
const verifyFullName = (value) => {
  return (
    value.trim().length > 0 &&
    value.includes(" ") &&
    isLetter(value[value.indexOf(" ") + 1])
  );
};

const fullNameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: verifyFullName(action.val) };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: verifyFullName(state.value) };
  }
  return { value: "", isValid: false };
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

const Register = () => {
  const [state, setState] = useState({});

  const [enteredFullNameTouched, setEnteredFullNameTouched] = useState(false);
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [degreeValue, setDegreeValue] = React.useState("Select Degree");

  const [alert, setAlert] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [fullNameState, dispatchFullName] = useReducer(fullNameReducer, {
    value: "",
    isValid: null,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  useEffect(() => {
    document.body.classList.toggle("register-page");
    return function cleanup() {
      document.body.classList.toggle("register-page");
    };
  });

  const { sendRequest } = useHttpClient();

  const history = useHistory();

  const { isValid: fullNameIsValid } = fullNameState;
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  const fullNameChangeHandler = (event) => {
    setState({ ...state, nameFocus: true });
    dispatchFullName({ type: "USER_INPUT", val: event.target.value });
  };

  const emailChangeHandler = (event) => {
    setState({ ...state, emailFocus: true });
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    setState({ ...state, passFocus: true });
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateFullNameHandler = () => {
    setState({ ...state, nameFocus: false });
    dispatchFullName({ type: "INPUT_BLUR" });
    setEnteredFullNameTouched(true);
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

  const degreeChangeHandler = (e) => {
    e.preventDefault();
    setDegreeValue(e.target.title);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  //pop up error message
  const degreeError = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Invalid degree"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      />
    );
  };

  // function that handles the registreation of the user and references to the dashboard page
  const dashboardPageHandler = async (e) => {
    e.preventDefault();

    const { value: fullNameValue } = fullNameState;
    const { value: emailValue } = emailState;
    const { value: passwordIValue } = passwordState;

    const enteredFullName = fullNameValue;
    const enteredEmail = emailValue;
    const enteredPassword = passwordIValue;
    const enteredDegree = degreeValue;

    // seperate full name to first name and last name
    let enteredFirstName;
    let enteredLastName;
    for (let i = 0; i < enteredFullName.length; i++) {
      if (enteredFullName[i] === " ") {
        enteredFirstName = enteredFullName.substring(0, i);
        enteredLastName = enteredFullName.substring(i + 1);

        break;
      }
    }

    if (degreeValue !== "Select Degree") {
      const url = "http://localhost:8080/login/user_signup";

      try {
        setIsLoading(true);

        await sendRequest(
          url,
          "POST",
          JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            first_name: enteredFirstName,
            last_name: enteredLastName,
            degree: enteredDegree,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        setIsLoading(false);
        const path = "/auth/login";
        history.push(path);
      } catch (err) {
        setIsLoading(false);
        exceptionHandler();
      }
    } else {
      degreeError();
    }
  };

  //pop up to exception
  const exceptionHandler = () => {
    console.log("in bag register");
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        Something did not work. <br />
        Please try again and check the values ​​you have entered.
      </ReactBSAlert>
    );
  };

  return (
    <>
      {alert}
      <div className="content">
        <Container>
          <Row>
            <Col className="ml-auto" md="5">
              <div className="info-area info-horizontal mt-5">
                <div className="icon icon-warning">
                  <i className="tim-icons icon-single-02" />
                </div>
                <div className="description">
                  <h3 className="info-title">Students</h3>
                  <p className="description">
                    We have created a simple and convenient platform for
                    scheduling meetings between students
                  </p>
                </div>
              </div>
              <div className="info-area info-horizontal">
                <div className="icon icon-primary">
                  <i className="tim-icons icon-check-2" />
                </div>
                <div className="description">
                  <h3 className="info-title">Why Kalena</h3>
                  <p className="description">
                    'Kalena' is a web application that enables personal calendar
                    management,
                    <br />
                    This application allows synchronization between college
                    courses and personal life.
                    <br />
                    The uniqueness of 'Kalena' is that it automatically finds
                    time for scheduling appointments,
                    <br />
                    by an algorithm that searches free time windows in the
                    calendars of selected participants.
                  </p>
                </div>
              </div>
            </Col>
            <Col className="mr-auto" md="7">
              <Card
                className="card-register card-white"
                style={{ width: "13.5cm", height: "16cm" }}
              >
                <CardHeader>
                  <CardImg
                    style={{ width: "100%", height: "99%" }}
                    alt="..."
                    src={require("assets/img/register.png").default}
                  />
                  <CardTitle
                    style={{
                      textTransform: "none",
                      fontSize: 60,
                      marginTop: 10,
                      marginBottom: -50,
                      marginLeft: 25,
                    }}
                    tag="h4"
                  >
                    Register
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="form">
                    <InputGroup
                      className={classnames({
                        "input-group-focus": state.nameFocus,
                      })}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          style={{
                            borderColor:
                              !fullNameIsValid && enteredFullNameTouched
                                ? "#e14eca"
                                : "#9a9a9a",
                          }}
                        >
                          <i className="tim-icons icon-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        style={{
                          borderColor:
                            !fullNameIsValid && enteredFullNameTouched
                              ? "#e14eca"
                              : "#9a9a9a",
                        }}
                        placeholder="Full Name"
                        type="text"
                        onChange={fullNameChangeHandler}
                        onBlur={validateFullNameHandler}
                      />
                    </InputGroup>
                    <FormGroup>
                      {!fullNameIsValid && enteredFullNameTouched && (
                        <label style={{ color: "#b40e0e" }}>
                          Invalid Full Name.
                        </label>
                      )}
                    </FormGroup>

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
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                      />
                    </InputGroup>
                    <FormGroup>
                      {!emailIsValid && enteredEmailTouched && (
                        <label style={{ color: "#b40e0e" }}>
                          Invalid email.
                        </label>
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
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                      />
                    </InputGroup>
                    <FormGroup>
                      {!passwordIsValid && enteredPasswordTouched && (
                        <label style={{ color: "#b40e0e" }}>
                          Password must contain more than 6 characters.
                        </label>
                      )}
                    </FormGroup>
                    <Row>
                      <Col lg="4" md="6" sm="3">
                        <FormGroup>
                          <label>Select Degree: </label>

                          <UncontrolledDropdown>
                            <DropdownToggle
                              aria-expanded={false}
                              aria-haspopup={true}
                              caret
                              className="btn-block"
                              color="defult"
                              data-toggle="dropdown"
                              id="dropdownMenuButton"
                              type="button"
                              style={{ width: "270px" }}
                            >
                              {degreeValue}
                            </DropdownToggle>
                            <DropdownMenu aria-labelledby="dropdownMenuButton">
                              <DropdownItem
                                href="#"
                                title="Computer Science"
                                onClick={(e) => degreeChangeHandler(e)}
                              >
                                Computer Science
                              </DropdownItem>
                              <DropdownItem
                                href="#"
                                title="Economics and Management"
                                onClick={(e) => degreeChangeHandler(e)}
                              >
                                Economics and Management
                              </DropdownItem>
                              <DropdownItem
                                href="#"
                                title="Information Systems"
                                onClick={(e) => degreeChangeHandler(e)}
                              >
                                Information Systems
                              </DropdownItem>
                              <DropdownItem
                                href="#"
                                title="Nursing Studies"
                                onClick={(e) => degreeChangeHandler(e)}
                              >
                                Nursing Studies
                              </DropdownItem>
                              <DropdownItem
                                href="#"
                                title="Behavioral Sciences"
                                onClick={(e) => degreeChangeHandler(e)}
                              >
                                Behavioral Sciences
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button
                    className="btn-round"
                    color="primary"
                    href="#kalena"
                    onClick={(e) => dashboardPageHandler(e)}
                    size="lg"
                    style={{ marginBottom: "-10px", marginTop: "38px" }}
                  >
                    {isLoading && <LoadingSpinner asOverlay />}
                    Create Account
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Register;
