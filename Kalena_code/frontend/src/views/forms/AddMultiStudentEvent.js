import React from "react";

// react component used to create alerts
import ReactBSAlert from "react-bootstrap-sweetalert";

//react date tim picker import
import ReactDatetime from "react-datetime";

// reactstrap components
import {
  FormGroup,
  Label,
  Row,
  Col,
  CardBody,
  Input,
  CardHeader,
  Card,
  Form,
} from "reactstrap";

const closeButtonStyle = {
  backgroundImage: "linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93)",
  color: "#ffffff",
  borderWidth: "1px",
  borderRadius: "30px",
  padding: "8px 18px",
};

const AddMultiStudentEvent = (props) => {
  //multi-student states
  const [emailNo1, setemailNo1] = React.useState("");
  const [emailStateNo1, setemailStateNo1] = React.useState("");

  const [emailNo2, setemailNo2] = React.useState("");
  const [emailStateNo2, setemailStateNo2] = React.useState("");

  const [emailNo3, setemailNo3] = React.useState("");
  const [emailStateNo3, setemailStateNo3] = React.useState("");

  const [emailNo4, setemailNo4] = React.useState("");
  const [emailStateNo4, setemailStateNo4] = React.useState("");

  //inputs changind state
  const [title, setTitle] = React.useState("");
  const [titleState, setTitleState] = React.useState("");

  const [description, setDescription] = React.useState("");
  const [address, setAddress] = React.useState("");

  //date time picker changing state
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const checkEmailValidation = () => {
    let isValid = false;
    if (emailNo1 !== "") isValid = emailStateNo1 === "has-success";
    if (emailNo2 !== "") isValid = isValid && emailStateNo2 === "has-success";
    if (emailNo3 !== "") isValid = isValid && emailStateNo3 === "has-success";
    if (emailNo4 !== "") isValid = isValid && emailStateNo4 === "has-success";

    return isValid;
  };

  //state function change the state value by the state input name
  const stateFunctions = {
    // form values
    setemailNo1: (value) => setemailNo1(value),
    setemailNo2: (value) => setemailNo2(value),
    setemailNo3: (value) => setemailNo3(value),
    setemailNo4: (value) => setemailNo4(value),

    // states to lable output
    setemailStateNo1: (value) => setemailStateNo1(value),
    setemailStateNo2: (value) => setemailStateNo2(value),
    setemailStateNo3: (value) => setemailStateNo3(value),
    setemailStateNo4: (value) => setemailStateNo4(value),
  };

  //function changing use state value by cases
  const change = (event, stateName, number) => {
    if (verifyEmail(event.target.value)) {
      stateFunctions["set" + stateName + "StateNo" + number]("has-success");
    } else {
      stateFunctions["set" + stateName + "StateNo" + number]("has-danger");
    }
    stateFunctions["set" + stateName + "No" + number](event.target.value);
  };

  //function prepare the participents array to send them the invitation.
  const checkForParticipants = () => {
    let participants = [];

    if (emailNo1 !== "" && emailStateNo1 === "has-success") {
      participants.push(emailNo1);
    }

    if (emailNo2 !== "" && emailStateNo2 === "has-success") {
      participants.push(emailNo2);
    }

    if (emailNo3 !== "" && emailStateNo3 === "has-success") {
      participants.push(emailNo3);
    }

    if (emailNo4 !== "" && emailStateNo4 === "has-success") {
      participants.push(emailNo4);
    }

    return participants;
  };

  //sending add event request from calendar by the user inputs
  const handleConfirm = () => {
    let validation = checkEmailValidation();

    if (titleState !== "has-success") validation = false;
    else {
      let sendTo = checkForParticipants();
      if (sendTo.length > 0) {
        props.onConfirm(
          title,
          description,
          address,
          "None",
          sendTo,
          startDate,
          endDate,
          "blue",
          validation
        );
      }
    }
  };

  const changeTitle = (title) => {
    if (title === "Welcome to Kalena" || title === "") {
      setTitleState("has-danger");
    } else {
      setTitleState("has-success");
    }
    setTitle(title);
  };

  //changing the dates depanding on date typr (end or start)
  const onDateTimeChange = (selectedDate, date) => {
    if (date === "start") {
      setStartDate(selectedDate._d);
    } else {
      setEndDate(selectedDate._d);
    }
  };

  return (
    <ReactBSAlert
      style={{
        width: "18cm",
        display: "block",
        marginTop: "-100px",
      }}
      title={"Add Multi-Student Event"}
      onConfirm={handleConfirm}
      onCancel={() => props.onCancel()}
      closeBtnStyle={closeButtonStyle}
      confirmBtnBsStyle={titleState === "has-success" ? "success" : "title"}
      cancelBtnBsStyle="danger"
      confirmBtnText="Add"
      cancelBtnText="Cancel"
      showCloseButton
      allowEscape
      showCancel
      btnSize=""
    >
      <br />
      <Row
        style={{
          margin: "auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card style={{ backgroundColor: "white", width: "20cm" }}>
          <CardHeader>
            <Label style={{ color: "black" }} tag="h4">
              Event Title:
            </Label>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Input
                type="text"
                onChange={(event) => changeTitle(event.target.value)}
              />
              <Row>
                <Label md="2" style={{ fontSize: "10px", color: "red" }}>
                  *required
                </Label>
              </Row>
            </FormGroup>
            {titleState === "has-danger" && (
              <label style={{ color: "red" }} className="error">
                This field is required.
              </label>
            )}
          </CardBody>
        </Card>
      </Row>

      <Row
        style={{
          margin: "auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Col md="4">
          <Card style={{ backgroundColor: "white" }}>
            <CardHeader>
              <Label style={{ color: "black" }} tag="h4">
                From:
              </Label>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <ReactDatetime
                  selected={startDate}
                  value={startDate}
                  inputProps={{
                    className: "form-control",
                    placeholder: "Datetime Picker Here",
                  }}
                  onChange={(e) => onDateTimeChange(e, "start")}
                />
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card style={{ backgroundColor: "white" }}>
            <CardHeader>
              <Label tag="h4" style={{ color: "black" }}>
                To:
              </Label>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <ReactDatetime
                  selected={endDate}
                  value={endDate}
                  inputProps={{
                    className: "form-control",
                    placeholder: "Datetime Picker Here",
                  }}
                  onChange={(e) => onDateTimeChange(e, "end")}
                />
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row
        style={{
          margin: "auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card style={{ backgroundColor: "white", width: "20cm" }}>
          <CardHeader>
            <Label style={{ color: "black" }} tag="h4">
              Details:
            </Label>
          </CardHeader>
          <CardBody>
            <Row>
              <Label sm="2" style={{ color: "black" }}>
                Description:
              </Label>
              <Col sm="10">
                <FormGroup>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    md="6"
                    placeholder="Free Input"
                    type="text"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Label sm="2" style={{ color: "black" }}>
                Address:
              </Label>
              <Col sm="10">
                <FormGroup>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    type="text"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Row>
      <Row
        style={{
          margin: "auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card style={{ backgroundColor: "white", width: "20cm" }}>
          <CardHeader>
            <Label style={{ color: "black" }} tag="h4">
              Invite Participants:
            </Label>
          </CardHeader>
          <CardBody>
            <Form action="#">
              <label style={{ color: "black" }}>#1 Student Email:</label>
              <FormGroup>
                <Input
                  name="email"
                  type="text"
                  onChange={(e) => change(e, "email", "1")}
                />
                {emailStateNo1 === "has-danger" ? (
                  <label style={{ color: "red" }} className="error">
                    Please enter a valid email address.
                  </label>
                ) : null}
              </FormGroup>
              <label style={{ color: "black" }}>#2 Student Email:</label>
              <FormGroup>
                <Input
                  name="email"
                  type="text"
                  onChange={(e) => change(e, "email", "2")}
                />
                {emailStateNo2 === "has-danger" ? (
                  <label style={{ color: "red" }} className="error">
                    Please enter a valid email address.
                  </label>
                ) : null}
              </FormGroup>
              <label style={{ color: "black" }}>#3 Student Email:</label>
              <FormGroup>
                <Input
                  name="email"
                  type="text"
                  onChange={(e) => change(e, "email", "3")}
                />
                {emailStateNo3 === "has-danger" ? (
                  <label style={{ color: "red" }} className="error">
                    Please enter a valid email address.
                  </label>
                ) : null}
              </FormGroup>
              <label style={{ color: "black" }}>#4 Student Email:</label>
              <FormGroup>
                <Input
                  name="email"
                  type="text"
                  onChange={(e) => change(e, "email", "4")}
                />
                {emailStateNo4 === "has-danger" ? (
                  <label style={{ color: "red" }} className="error">
                    Please enter a valid email address.
                  </label>
                ) : null}
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Row>
      <br />
    </ReactBSAlert>
  );
};

export default AddMultiStudentEvent;
