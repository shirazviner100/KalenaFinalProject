import React, { useContext } from "react";

import ReactBSAlert from "react-bootstrap-sweetalert";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Label,
  CardTitle,
  CardBody,
  CardFooter,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import AuthContext from "views/store/auth-context";
import LoadingSpinner from "components/FormElements/LoadingSpinner";
import { useHttpClient } from "../../components/hooks/http-hook.js";

const User = () => {
  //inputs states to update in DB
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [degreeValue, setDegreeValue] = React.useState("");

  const [alert, setAlert] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { sendRequest } = useHttpClient();

  const authCtx = useContext(AuthContext);

  React.useEffect(() => {
    setIsLoading(true);
    setFirstName(authCtx.user.first_name);
    setLastName(authCtx.user.last_name);
    setAddress(authCtx.user.address);
    setCity(authCtx.user.city);
    setDegreeValue(authCtx.user.degree);
    setEmail(authCtx.user.email);
    setIsLoading(false);
  }, [
    authCtx.user.first_name,
    authCtx.user.last_name,
    authCtx.user.address,
    authCtx.user.city,
    authCtx.user.degree,
    authCtx.user.email,
  ]);

  const hideAlert = () => {
    setAlert(null);
  };

  //pop up to exception
  const exceptionHandler = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        Something did not work. <br />
        Please try again and check the values ​​you have entered.
      </ReactBSAlert>
    );
  };

  //pop up message to success
  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Mission Accomplished !!!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        Your details have been updated.
      </ReactBSAlert>
    );
  };

  //changing last name state by user input
  const lastNameChangeHandler = (e) => {
    if (e.target.value !== lastName) {
      setLastName(e.target.value);
    }
  };

  //changing address state by user input
  const addressChangeHandler = (e) => {
    if (e.target.value !== address) {
      setAddress(e.target.value);
    }
  };

  //changind city state value by user input
  const cityChangeHandler = (e) => {
    if (e.target.value !== city) {
      setCity(e.target.value);
    }
  };

  //changing degree state
  const degreeChangeHandler = (e) => {
    e.preventDefault();
    setDegreeValue(e.target.title);
  };

  //changing first name state value
  const firstNameChangeHandler = (e) => {
    if (e.target.value !== firstName) {
      setFirstName(e.target.value);
    }
  };

  const saveClickHandler = async () => {
    authCtx.updateUser(firstName, lastName, city, address, degreeValue);

    const urlUpdateUser = `http://localhost:8080/user/update_user/${authCtx.userId}`;

    try {
      setIsLoading(true);

      await sendRequest(
        urlUpdateUser,
        "PUT",
        JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          city: city,
          address: address,
          degree: degreeValue,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );

      setIsLoading(false);
      successAlert();
    } catch (err) {
      setIsLoading(false);
      exceptionHandler();
    }
  };

  return (
    <>
      <div className="content">
        {alert}
        {authCtx.isLoggedIn ? (
          <div>
            <Row>
              <Col md="8">
                <Card>
                  {isLoading && <LoadingSpinner asOverlay />}
                  <CardHeader>
                    <h5 className="title">Edit Profile</h5>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col className="pr-md-1" md="5">
                          <FormGroup>
                            <label>School Name</label>
                            <Input defaultValue="MTA" disabled type="text" />
                          </FormGroup>
                        </Col>

                        <Col className="pl-md-1" md="4">
                          <FormGroup>
                            <label>Email address</label>
                            <Input value={email} disabled type="email" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-md-1" md="6">
                          <FormGroup>
                            <label>First Name</label>
                            <Input
                              value={firstName}
                              onChange={(e) => firstNameChangeHandler(e)}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col className="pl-md-1" md="6">
                          <FormGroup>
                            <label>Last Name</label>
                            <Input
                              value={lastName}
                              onChange={(e) => lastNameChangeHandler(e)}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Address</label>
                            <Input
                              value={address}
                              onChange={(e) => addressChangeHandler(e)}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-md-1" md="4">
                          <FormGroup>
                            <label>City</label>
                            <Input
                              value={city}
                              onChange={(e) => cityChangeHandler(e)}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col className="px-md-1" md="4">
                          <FormGroup>
                            <label>Country</label>
                            <Input disabled value="Israel" type="text" />
                          </FormGroup>
                        </Col>
                      </Row>
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
                      onClick={saveClickHandler}
                      className="btn-fill"
                      color="primary"
                      type="submit"
                    >
                      {isLoading && <LoadingSpinner asOverlay />}
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
              <Col md="4">
                <Card className="card-user">
                  <CardBody>
                    <CardText />
                    <div className="author">
                      <div className="block block-one" />
                      <div className="block block-two" />
                      <div className="block block-three" />
                      <div className="block block-four" />
                      <h5 className="title">
                        {firstName !== "" && lastName !== ""
                          ? "Hello " + firstName + " " + lastName
                          : "Welcome Back :)"}
                      </h5>
                      <p className="description">
                        {"Student of - " + degreeValue}
                      </p>
                      <br />
                      <img
                        alt="..."
                        src={require("assets/img/newMTA.png").default}
                      />{" "}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <Card style={{ width: "20cm", marginLeft: "7cm", marginTop: "2cm" }}>
            <CardHeader>
              <CardTitle tag="h2">Hello</CardTitle>
            </CardHeader>
            <CardBody>
              <Label tag="h4">
                In order to use our website you must log-in / register.
              </Label>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
};

export default User;
